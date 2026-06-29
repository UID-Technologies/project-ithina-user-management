import { z } from 'zod';
import { ROLE_TYPES } from '../../common/enums';

export const createRoleSchema = z.object({
  name: z.string().min(2),
  type: z.enum(ROLE_TYPES),
  description: z.string().optional(),
  isCustom: z.boolean().optional(),
  inheritsFrom: z.array(z.string()).optional(),
  tenantId: z.string().optional(),
  permissionIds: z.array(z.string()).optional(),
});

export const updateRoleSchema = createRoleSchema.partial();
export const roleIdParamSchema = z.object({ id: z.string().min(1) });
export const roleListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  type: z.enum(ROLE_TYPES).optional(),
  tenantId: z.string().optional(),
});
