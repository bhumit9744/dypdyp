"""
Computer Vision Camera Telemetry Service — Placement Hub
Separate OpenCV-based module for real-time camera quality, lighting, and framing diagnostics.

STRICT ETHICAL & PRIVACY COMPLIANCE:
All measurements are strictly camera ergonomics and visibility diagnostics.
They are NEVER used to infer honesty, intelligence, cheating, or interview suitability.
Continuous frames are processed locally/server-side with OpenCV and NEVER sent to Claude.
"""

import os
import base64
import logging
try:
    import cv2
    import numpy as np
    CV2_AVAILABLE = True
except ImportError:
    cv2 = None
    np = None
    CV2_AVAILABLE = False
from typing import Dict, Any, Optional, Tuple
from pydantic import BaseModel, Field

logger = logging.getLogger("vision_service")

# ---------------------------------------------------------------------------
# Output Schema
# ---------------------------------------------------------------------------

class VisionAnalysisResult(BaseModel):
    face_detected: bool = Field(..., description="Whether at least one human face was detected")
    face_count: int = Field(..., description="Number of detected faces")
    approx_head_pose: str = Field(..., description="Approximated framing direction: Looking Forward, Turned Left, Turned Right, Looking Down, Looking Up, Undetermined")
    lighting_quality: str = Field(..., description="Lighting assessment: Good Lighting, Too Dark, Too Bright, Low Contrast")
    mean_brightness: float = Field(..., description="Average luminance 0.0 - 255.0")
    frame_blur_score: float = Field(..., description="Laplacian variance; higher indicates sharper focus")
    is_blurry: bool = Field(..., description="True if blur score is below threshold")
    obstruction_detected: bool = Field(default=False, description="True if significant camera lens obstruction is detected")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Measurement reliability score")
    disclaimer: str = Field(
        default="Camera positioning and lighting indicator only. Never factored into interview scores or honesty assessments."
    )


# ---------------------------------------------------------------------------
# OpenCV Vision Analyzer
# ---------------------------------------------------------------------------

class VisionAnalyzer:
    def __init__(self):
        self.face_cascade = None
        self.eye_cascade = None
        # Try loading Haar Cascades if available in this OpenCV build
        try:
            if hasattr(cv2, 'CascadeClassifier') and hasattr(cv2, 'data') and hasattr(cv2.data, 'haarcascades'):
                cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
                if os.path.exists(cascade_path):
                    self.face_cascade = cv2.CascadeClassifier(cascade_path)
                eye_path = cv2.data.haarcascades + 'haarcascade_eye.xml'
                if os.path.exists(eye_path):
                    self.eye_cascade = cv2.CascadeClassifier(eye_path)
        except Exception:
            self.face_cascade = None
            self.eye_cascade = None
        self.initialized = True

    def process_frame_base64(self, base64_image_data: str) -> VisionAnalysisResult:
        """
        Processes a single webcam snapshot encoded in base64.
        """
        try:
            # Strip data url header if present
            if "," in base64_image_data:
                base64_image_data = base64_image_data.split(",", 1)[1]

            image_bytes = base64.b64decode(base64_image_data)
            np_arr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if img is None:
                raise ValueError("Could not decode image buffer into valid OpenCV frame.")

            return self.analyze_image(img)
        except Exception as e:
            logger.warning(f"Error processing vision frame: {e}")
            return VisionAnalysisResult(
                face_detected=False,
                face_count=0,
                approx_head_pose="Undetermined (Processing Error)",
                lighting_quality="Undetermined",
                mean_brightness=0.0,
                frame_blur_score=0.0,
                is_blurry=False,
                obstruction_detected=False,
                confidence=0.0
            )

    def analyze_image(self, img: Any) -> VisionAnalysisResult:
        """
        Runs genuine OpenCV computer vision analysis on a frame.
        """
        height, width = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 1. Lighting assessment
        mean_brightness = float(np.mean(gray))
        contrast = float(np.std(gray))

        if mean_brightness < 45.0:
            lighting = "Too Dark (Insufficient illumination)"
        elif mean_brightness > 215.0:
            lighting = "Too Bright (Overexposed)"
        elif contrast < 20.0:
            lighting = "Low Contrast (Washed out)"
        else:
            lighting = "Good Lighting"

        # 2. Blur detection via Laplacian variance
        laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        is_blurry = laplacian_var < 35.0

        # 3. Obstruction check (very low variance across entire frame or extreme black/white)
        obstruction = bool(contrast < 10.0 or mean_brightness < 15.0)

        # 4. Face Detection (Haar cascade or Chrominance contour analysis)
        face_detected = False
        face_count = 0
        detected_boxes = []

        if self.face_cascade is not None:
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(50, 50)
            )
            face_count = len(faces)
            face_detected = face_count > 0
            detected_boxes = faces
        else:
            # Fallback for OpenCV 5 headless / modern: YCrCb skin chrominance segmentation
            ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
            lower_skin = np.array([0, 133, 77], dtype=np.uint8)
            upper_skin = np.array([255, 173, 127], dtype=np.uint8)
            skin_mask = cv2.inRange(ycrcb, lower_skin, upper_skin)
            # Morphological cleanup
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_OPEN, kernel, iterations=2)
            skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_DILATE, kernel, iterations=2)

            contours, _ = cv2.findContours(skin_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            min_face_area = (width * height) * 0.015  # at least 1.5% of frame
            max_face_area = (width * height) * 0.70

            for c in contours:
                area = cv2.contourArea(c)
                if min_face_area < area < max_face_area:
                    x, y, w, h = cv2.boundingRect(c)
                    aspect_ratio = float(h) / w if w > 0 else 0
                    if 0.8 <= aspect_ratio <= 2.2:
                        detected_boxes.append((x, y, w, h))

            face_count = len(detected_boxes)
            face_detected = face_count > 0

        # 5. Approximate Head Pose / Framing
        approx_head_pose = "Undetermined (No Face Visible)"
        confidence = 0.5

        if face_detected:
            # Sort by area to find largest face
            boxes_sorted = sorted(detected_boxes, key=lambda f: f[2] * f[3], reverse=True)
            x, y, w, h = boxes_sorted[0]

            face_center_x = x + (w / 2.0)
            face_center_y = y + (h / 2.0)
            frame_center_x = width / 2.0
            frame_center_y = height / 2.0

            # Normalized offset: -1 (left/top) to +1 (right/bottom)
            dx = (face_center_x - frame_center_x) / frame_center_x
            dy = (face_center_y - frame_center_y) / frame_center_y

            # Check eyes in face ROI if cascade available
            eyes = []
            if self.eye_cascade is not None:
                face_roi_gray = gray[y : y + int(h * 0.6), x : x + w]
                eyes = self.eye_cascade.detectMultiScale(face_roi_gray, scaleFactor=1.1, minNeighbors=3)

            if dx < -0.35:
                approx_head_pose = "Turned Left (Framing Offset)"
            elif dx > 0.35:
                approx_head_pose = "Turned Right (Framing Offset)"
            elif dy > 0.35:
                approx_head_pose = "Looking Down (Framing Offset)"
            elif dy < -0.35:
                approx_head_pose = "Looking Up (Framing Offset)"
            elif len(eyes) >= 1:
                approx_head_pose = "Looking Forward"
            else:
                approx_head_pose = "Centered (Gaze Estimated)"

            # Confidence based on face size, lighting, and sharpness
            face_ratio = (w * h) / (width * height)
            size_confidence = min(1.0, face_ratio / 0.08) # optimal face size ~8% of screen
            blur_confidence = min(1.0, laplacian_var / 100.0)
            confidence = float(np.clip(0.4 * size_confidence + 0.3 * blur_confidence + 0.3 * (1.0 if "Good" in lighting else 0.5), 0.2, 1.0))
        else:
            confidence = 0.8 if not obstruction else 0.3

        return VisionAnalysisResult(
            face_detected=face_detected,
            face_count=face_count,
            approx_head_pose=approx_head_pose,
            lighting_quality=lighting,
            mean_brightness=round(mean_brightness, 1),
            frame_blur_score=round(laplacian_var, 1),
            is_blurry=is_blurry,
            obstruction_detected=obstruction,
            confidence=round(confidence, 2)
        )

# Global singleton
vision_analyzer = VisionAnalyzer()
