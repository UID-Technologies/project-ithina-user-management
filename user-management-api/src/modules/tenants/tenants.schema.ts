import { z } from 'zod';
import {
  MODULE_KEYS,
  TENANT_STATUSES,
  TENANT_TIERS,
} from '../../common/enums';

export const createTenantSchema = z.object({
  name: z.string().min(2),
  tier: z.enum(TENANT_TIERS),
  industry: z.string().min(2),
  country: z.string().min(2),
  storesCount: z.number().int().min(0).optional(),
  status: z.enum(TENANT_STATUSES).optional(),
  modules: z.array(z.enum(MODULE_KEYS)).min(1).optional(),
  primaryContact: z.string().optional(),
  contactEmail: z.string().email().optional(),
  monthlyRevenue: z.number().min(0).optional(),
});

export const updateTenantSchema = createTenantSchema.partial();

export const tenantIdParamSchema = z.object({
  id: z.string().min(1),
});

export const tenantListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  status: z.enum(TENANT_STATUSES).optional(),
  tier: z.enum(TENANT_TIERS).optional(),
  search: z.string().optional(),
});
