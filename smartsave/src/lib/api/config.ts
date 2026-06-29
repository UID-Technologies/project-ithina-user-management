export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3002';

export const AUTH_STORAGE_KEY = 'ithina.superadmin.token';

export const SUPERADMIN_CREDENTIALS = {
  email: import.meta.env.VITE_SUPERADMIN_EMAIL || 'anjali@ithina.ai',
  password: import.meta.env.VITE_SUPERADMIN_PASSWORD || 'SuperAdmin123!',
};
