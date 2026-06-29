import { z } from 'zod';
import { APPROVAL_STATUSES } from '../../common/enums';

export const approvalListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  status: z.enum(APPROVAL_STATUSES).optional(),
  tenantId: z.string().optional(),
});
