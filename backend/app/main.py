from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import engine, Base, init_db_schema
from .models import models
from .api.endpoints import router as api_router
from .api.interview_endpoints import router as interview_router
from .api.roadmap_endpoints import router as roadmap_router
from .api.resume_endpoints import router as resume_router

# Initialize database tables and columns
init_db_schema()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Placement Hub API - PS6 Hackathon Foundation"
)

# CORS setup for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development allow all for seamless local pair programming
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(interview_router, prefix="/api/v1")
app.include_router(roadmap_router, prefix="/api/v1")
app.include_router(resume_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "message": "Placement Hub API is running",
        "docs": "/docs",
        "health": "/api/v1/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
