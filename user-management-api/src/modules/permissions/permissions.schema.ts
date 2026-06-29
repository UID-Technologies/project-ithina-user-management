import { z } from 'zod';
import { MODULE_KEYS } from '../../common/enums';

export const permissionListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  module: z.enum(MODULE_KEYS).optional(),
});
