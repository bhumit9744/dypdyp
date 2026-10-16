import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { MediaCallError } from '../../hooks/useMediaCall';

interface MediaErrorBannerProps {
  error: MediaCallError;
  onRetry?: () => void;
  isRetrying?: boolean;
}

/**
 * MediaErrorBanner — detailed, actionable permission/device error surface for the
 * interview room. Shown in permission-denied, no-device, busy-device and
 * unsupported-browser states.
 */
export const MediaErrorBanner: React.FC<MediaErrorBannerProps> = ({ error, onRetry, isRetrying = false }) => {
  return (
    <div
      className="p-4 md:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-900 dark:text-rose-100 flex items-start gap-3"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-1.5">
        <p className="font-bold text-sm">{error.title}</p>
        <p className="leading-relaxed">{error.message}</p>
        <p className="leading-relaxed text-rose-800/90 dark:text-rose-200/90">
          <strong>How to fix:</strong> {error.instructions}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
          >
            {isRetrying ? 'Retrying…' : 'Join again'}
          </button>
        )}
      </div>
    </div>
  );
};
