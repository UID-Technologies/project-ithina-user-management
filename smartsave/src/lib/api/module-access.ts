import type { Module, ModuleKey } from '@/data/superadminData';
import { apiGet, apiGetList, apiPatch } from './client';

export interface TenantModuleAccess {
  tenantId: string;
  enabledModules: ModuleKey[];
}

export async function fetchModules(): Promise<Module[]> {
  return apiGet<Module[]>('/api/v1/superadmin/module-access/modules');
}

export async function fetchTenantModuleAccessList(): Promise<TenantModuleAccess[]> {
  const { items } = await apiGetList<TenantModuleAccess[]>('/api/v1/superadmin/module-access');
  return items;
}

export async function toggleModuleAccess(
  tenantId: string,
  module: ModuleKey,
  enabled: boolean,
): Promise<TenantModuleAccess> {
  return apiPatch<TenantModuleAccess>(
    `/api/v1/superadmin/module-access/${tenantId}/toggle`,
    { module, enabled },
  );
}
