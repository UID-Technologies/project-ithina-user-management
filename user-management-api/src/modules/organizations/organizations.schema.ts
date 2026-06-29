import { z } from 'zod';
import { LOCATION_TYPES } from '../../common/enums';

export const createLocationSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(2),
  type: z.enum(LOCATION_TYPES),
  parentId: z.string().nullable().optional(),
  code: z.string().optional(),
});

export const updateLocationSchema = createLocationSchema.omit({ tenantId: true }).partial();
export const locationIdParamSchema = z.object({ id: z.string().min(1) });
export const orgTreeQuerySchema = z.object({ tenantId: z.string().min(1) });
