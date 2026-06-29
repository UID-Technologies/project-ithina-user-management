import { ModuleKey, TenantStatus, TenantTier } from '../../common/enums';

export interface TenantDto {
  id: string;
  name: string;
  tier: TenantTier;
  industry: string;
  country: string;
  storesCount: number;
  usersCount: number;
  status: TenantStatus;
  createdAt: string;
  modules: ModuleKey[];
  primaryContact: string;
  contactEmail: string;
  monthlyRevenue: number;
}

export interface CreateTenantDto {
  name: string;
  tier: TenantTier;
  industry: string;
  country: string;
  storesCount?: number;
  status?: TenantStatus;
  modules?: ModuleKey[];
  primaryContact?: string;
  contactEmail?: string;
  monthlyRevenue?: number;
}

export type UpdateTenantDto = Partial<CreateTenantDto>;
