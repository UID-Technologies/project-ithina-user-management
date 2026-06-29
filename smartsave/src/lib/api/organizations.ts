import type { Location } from '@/data/superadminData';
import { apiDelete, apiGet, apiPost, apiPut } from './client';

export interface CreateLocationPayload {
  tenantId: string;
  name: string;
  type: Location['type'];
  parentId?: string | null;
  code?: string;
}

export type UpdateLocationPayload = Partial<Omit<CreateLocationPayload, 'tenantId'>>;

export async function fetchLocations(tenantId: string): Promise<Location[]> {
  return apiGet<Location[]>(
    `/api/v1/superadmin/organizations?tenantId=${encodeURIComponent(tenantId)}`,
  );
}

export async function fetchOrganizationTree(tenantId: string): Promise<Location[]> {
  return apiGet<Location[]>(
    `/api/v1/superadmin/organizations/tree?tenantId=${encodeURIComponent(tenantId)}`,
  );
}

export async function fetchLocationById(id: string): Promise<Location> {
  return apiGet<Location>(`/api/v1/superadmin/organizations/${id}`);
}

export async function createLocation(payload: CreateLocationPayload): Promise<Location> {
  return apiPost<Location>('/api/v1/superadmin/organizations', payload);
}

export async function updateLocation(
  id: string,
  payload: UpdateLocationPayload,
): Promise<Location> {
  return apiPut<Location>(`/api/v1/superadmin/organizations/${id}`, payload);
}

export async function deleteLocation(id: string): Promise<void> {
  await apiDelete(`/api/v1/superadmin/organizations/${id}`);
}
