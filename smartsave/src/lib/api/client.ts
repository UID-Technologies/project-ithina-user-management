import { API_BASE_URL, AUTH_STORAGE_KEY } from './config';
import { ApiError, ApiResponse } from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(AUTH_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) sessionStorage.setItem(AUTH_STORAGE_KEY, token);
  else sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token, signal }: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const authToken = token ?? getStoredToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  let payload: ApiResponse<T>;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('Invalid server response', response.status);
  }

  if (!response.ok || !payload.success) {
    throw new ApiError(payload.message || 'Request failed', response.status, payload.errors);
  }

  return payload;
}

export async function apiGet<T>(path: string, token?: string | null): Promise<T> {
  const res = await apiRequest<T>(path, { token });
  return res.data as T;
}

export async function apiGetList<T>(
  path: string,
  token?: string | null,
): Promise<{ items: T; meta?: ApiResponse<T>['meta'] }> {
  const res = await apiRequest<T>(path, { token });
  return { items: res.data as T, meta: res.meta };
}

export async function apiPost<T>(path: string, body: unknown, token?: string | null): Promise<T> {
  const res = await apiRequest<T>(path, { method: 'POST', body, token });
  return res.data as T;
}

export async function apiPut<T>(path: string, body: unknown, token?: string | null): Promise<T> {
  const res = await apiRequest<T>(path, { method: 'PUT', body, token });
  return res.data as T;
}

export async function apiPatch<T>(path: string, body: unknown, token?: string | null): Promise<T> {
  const res = await apiRequest<T>(path, { method: 'PATCH', body, token });
  return res.data as T;
}

export async function apiDelete(path: string, token?: string | null): Promise<void> {
  await apiRequest<null>(path, { method: 'DELETE', token });
}
