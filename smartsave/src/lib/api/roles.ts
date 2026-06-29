import type { Role, RoleType } from '@/data/superadminData';
import { apiDelete, apiGet, apiGetList, apiPost, apiPut } from './client';

export interface RoleListParams {
  type?: RoleType;
  tenantId?: string;
  page?: number;
  limit?: number;
}

export interface CreateRolePayload {
  name: string;
  type: RoleType;
  description?: string;
  isCustom?: boolean;
  inheritsFrom?: string[];
  tenantId?: string;
  permissionIds?: string[];
}

export type UpdateRolePayload = Partial<CreateRolePayload>;

function buildQuery(params: RoleListParams = {}): string {
  const query = new URLSearchParams();
  query.set('limit', String(params.limit ?? 100));
  query.set('page', String(params.page ?? 1));
  if (params.type) query.set('type', params.type);
  if (params.tenantId) query.set('tenantId', params.tenantId);
  return query.toString();
}

export async function fetchRoles(params?: RoleListParams): Promise<Role[]> {
  const { items } = await apiGetList<Role[]>(`/api/v1/superadmin/roles?${buildQuery(params)}`);
  return items;
}

export async function fetchRoleById(id: string): Promise<Role> {
  return apiGet<Role>(`/api/v1/superadmin/roles/${id}`);
}

export async function createRole(payload: CreateRolePayload): Promise<Role> {
  return apiPost<Role>('/api/v1/superadmin/roles', payload);
}

export async function updateRole(id: string, payload: UpdateRolePayload): Promise<Role> {
  return apiPut<Role>(`/api/v1/superadmin/roles/${id}`, payload);
}

export async function deleteRole(id: string): Promise<void> {
  await apiDelete(`/api/v1/superadmin/roles/${id}`);
}
