import type { ModuleKey, Tenant, TenantTier } from '@/data/superadminData';
import { apiDelete, apiGet, apiGetList, apiPost, apiPut } from './client';

export interface TenantListParams {
  search?: string;
  tier?: string;
  status?: Tenant['status'];
  page?: number;
  limit?: number;
}

export interface CreateTenantPayload {
  name: string;
  tier: TenantTier;
  industry: string;
  country: string;
  storesCount?: number;
  status?: Tenant['status'];
  modules?: ModuleKey[];
  primaryContact?: string;
  contactEmail?: string;
  monthlyRevenue?: number;
}

export type UpdateTenantPayload = Partial<CreateTenantPayload>;

function buildQuery(params: TenantListParams = {}): string {
  const query = new URLSearchParams();
  query.set('limit', String(params.limit ?? 100));
  query.set('page', String(params.page ?? 1));
  if (params.search?.trim()) query.set('search', params.search.trim());
  if (params.tier && params.tier !== 'all') query.set('tier', params.tier);
  if (params.status) query.set('status', params.status);
  return query.toString();
}

export async function fetchTenants(params?: TenantListParams): Promise<Tenant[]> {
  const { items } = await apiGetList<Tenant[]>(
    `/api/v1/superadmin/tenants?${buildQuery(params)}`,
  );
  return items;
}

export async function fetchTenantById(id: string): Promise<Tenant> {
  return apiGet<Tenant>(`/api/v1/superadmin/tenants/${id}`);
}

export async function createTenant(payload: CreateTenantPayload): Promise<Tenant> {
  return apiPost<Tenant>('/api/v1/superadmin/tenants', payload);
}

export async function updateTenant(id: string, payload: UpdateTenantPayload): Promise<Tenant> {
  return apiPut<Tenant>(`/api/v1/superadmin/tenants/${id}`, payload);
}

export async function deleteTenant(id: string): Promise<void> {
  await apiDelete(`/api/v1/superadmin/tenants/${id}`);
}
