import { z } from 'zod';
import { USER_STATUSES } from '../../common/enums';

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  tenantId: z.string().min(1),
  roleIds: z.array(z.string()).optional(),
  locationIds: z.array(z.string()).optional(),
  status: z.enum(USER_STATUSES).optional(),
  mfaEnabled: z.boolean().optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const userIdParamSchema = z.object({ id: z.string().min(1) });

export const userListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  tenantId: z.string().optional(),
  status: z.enum(USER_STATUSES).optional(),
  search: z.string().optional(),
});
