import type { Permission } from '@/data/superadminData';
import { apiGet, apiGetList } from './client';

export type RolePermissionMap = Record<string, string[]>;

export interface PermissionListParams {
  module?: string;
  page?: number;
  limit?: number;
}

function buildQuery(params: PermissionListParams = {}): string {
  const query = new URLSearchParams();
  query.set('limit', String(params.limit ?? 100));
  query.set('page', String(params.page ?? 1));
  if (params.module) query.set('module', params.module);
  return query.toString();
}

export async function fetchPermissions(params?: PermissionListParams): Promise<Permission[]> {
  const { items } = await apiGetList<Permission[]>(
    `/api/v1/superadmin/permissions?${buildQuery(params)}`,
  );
  return items;
}

export async function fetchRolePermissionMap(): Promise<RolePermissionMap> {
  return apiGet<RolePermissionMap>('/api/v1/superadmin/permissions/role-map');
}
