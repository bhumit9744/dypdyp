/**
 * Placement Hub - Centralized API & Environment Configuration
 * Dynamically resolves API_BASE based on Vite environment variables.
 */

const rawBase = (import.meta.env.VITE_API_BASE as string | undefined)?.trim();

const formatApiBase = (url?: string): string => {
  if (!url) return 'http://127.0.0.1:8000/api/v1';
  let formatted = url.replace(/\/+$/, '');
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = `https://${formatted}`;
  }
  if (!formatted.endsWith('/api/v1')) {
    formatted = `${formatted}/api/v1`;
  }
  return formatted;
};

export const API_BASE = formatApiBase(rawBase);

export const BACKEND_URL =
  API_BASE.replace(/\/api\/v1\/?$/, '') || 'http://127.0.0.1:8000';

