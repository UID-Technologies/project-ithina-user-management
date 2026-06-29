import type { User } from '@/data/superadminData';
import { apiDelete, apiGet, apiGetList, apiPost, apiPut } from './client';

export interface UserListParams {
  search?: string;
  tenantId?: string;
  status?: User['status'];
  page?: number;
  limit?: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  tenantId: string;
  roleIds?: string[];
  locationIds?: string[];
  status?: User['status'];
  mfaEnabled?: boolean;
}

export type UpdateUserPayload = Partial<CreateUserPayload>;

function buildQuery(params: UserListParams = {}): string {
  const query = new URLSearchParams();
  query.set('limit', String(params.limit ?? 100));
  query.set('page', String(params.page ?? 1));
  if (params.search?.trim()) query.set('search', params.search.trim());
  if (params.tenantId && params.tenantId !== 'all') query.set('tenantId', params.tenantId);
  if (params.status) query.set('status', params.status);
  return query.toString();
}

export async function fetchUsers(params?: UserListParams): Promise<User[]> {
  const { items } = await apiGetList<User[]>(`/api/v1/superadmin/users?${buildQuery(params)}`);
  return items;
}

export async function fetchUserById(id: string): Promise<User> {
  return apiGet<User>(`/api/v1/superadmin/users/${id}`);
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  return apiPost<User>('/api/v1/superadmin/users', payload);
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  return apiPut<User>(`/api/v1/superadmin/users/${id}`, payload);
}

export async function deleteUser(id: string): Promise<void> {
  await apiDelete(`/api/v1/superadmin/users/${id}`);
}
