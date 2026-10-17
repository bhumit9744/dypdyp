/**
 * Placement Hub - Centralized API & Environment Configuration
 * Dynamically resolves API_BASE based on Vite environment variables.
 */

export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/+$/, '') ||
  'http://127.0.0.1:8000/api/v1';

export const BACKEND_URL =
  API_BASE.replace(/\/api\/v1\/?$/, '') || 'http://127.0.0.1:8000';
