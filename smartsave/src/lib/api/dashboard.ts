import { apiGet } from './client';
import type { AuditLog } from '@/data/superadminData';

export interface DashboardSummary {
  activeTenants: number;
  totalTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  platformUsers: number;
  storesUnderManagement: number;
  mrr: number;
  pendingApprovals: number;
  guardrailsFired24h: number;
  guardrailEscalations24h: number;
  customRoles: number;
  totalRoles: number;
  modulesDeployed: number;
  countriesCount: number;
  totalUsers: number;
  totalStores: number;
  monthlyRevenue: number;
  guardrailsTriggered24h: number;
}

export interface TopTenantRow {
  id: string;
  name: string;
  industry: string;
  country: string;
  usersCount: number;
  storesCount: number;
  tier: string;
}

export interface PlatformHealth {
  status: 'operational' | 'degraded' | 'outage';
  message: string;
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiGet<DashboardSummary>('/api/v1/superadmin/dashboard/summary');
}

export async function fetchTopTenants(limit = 5): Promise<TopTenantRow[]> {
  return apiGet<TopTenantRow[]>(`/api/v1/superadmin/dashboard/top-tenants?limit=${limit}`);
}

export async function fetchRecentActivity(limit = 6): Promise<AuditLog[]> {
  return apiGet<AuditLog[]>(`/api/v1/superadmin/dashboard/recent-activity?limit=${limit}`);
}

export async function fetchPlatformHealth(): Promise<PlatformHealth> {
  return apiGet<PlatformHealth>('/api/v1/superadmin/dashboard/platform-health');
}
