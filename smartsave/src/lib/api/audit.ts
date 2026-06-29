import type { AuditLog } from '@/data/superadminData';
import { apiGetList } from './client';

export interface AuditListParams {
  search?: string;
  tenant?: string;
  result?: AuditLog['result'] | 'all';
  actor?: string;
  page?: number;
  limit?: number;
}

function buildQuery(params: AuditListParams = {}): string {
  const query = new URLSearchParams();
  query.set('limit', String(params.limit ?? 200));
  query.set('page', String(params.page ?? 1));
  if (params.search?.trim()) query.set('search', params.search.trim());
  if (params.tenant?.trim()) query.set('tenant', params.tenant.trim());
  if (params.result && params.result !== 'all') query.set('result', params.result);
  if (params.actor?.trim()) query.set('actor', params.actor.trim());
  return query.toString();
}

export async function fetchAuditLogs(params?: AuditListParams): Promise<AuditLog[]> {
  const { items } = await apiGetList<AuditLog[]>(
    `/api/v1/superadmin/audit?${buildQuery(params)}`,
  );
  return items;
}
