import { apiGet, apiPost, setStoredToken } from './client';
import { SUPERADMIN_CREDENTIALS } from './config';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roleIds: string[];
  tenantId: string | 'platform';
  locationIds?: string[];
  primaryRoleName?: string;
  tenantName?: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: string;
  user: AuthUser;
}

export async function login(
  email = SUPERADMIN_CREDENTIALS.email,
  password = SUPERADMIN_CREDENTIALS.password,
): Promise<LoginResponse> {
  const data = await apiPost<LoginResponse>('/api/v1/auth/login', { email, password }, null);
  setStoredToken(data.accessToken);
  return data;
}

export async function fetchMe(): Promise<AuthUser> {
  return apiGet<AuthUser>('/api/v1/auth/me');
}

export function logout(): void {
  setStoredToken(null);
}
