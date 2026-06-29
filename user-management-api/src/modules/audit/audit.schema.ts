import { z } from 'zod';
import { AUDIT_RESULTS } from '../../common/enums';

export const auditListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  tenant: z.string().optional(),
  result: z.enum(AUDIT_RESULTS).optional(),
  actor: z.string().optional(),
  search: z.string().optional(),
});
