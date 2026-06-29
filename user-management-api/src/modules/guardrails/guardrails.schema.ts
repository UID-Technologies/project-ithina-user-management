import { z } from 'zod';
import { GUARDRAIL_STATUSES, MODULE_KEYS } from '../../common/enums';

export const createGuardrailRuleSchema = z.object({
  name: z.string().min(3).max(80),
  module: z.enum(MODULE_KEYS),
  trigger: z.string().min(5).max(200),
  approvers: z.array(z.string()).min(1),
  escalateAfterHours: z.number().int().min(1).max(168),
  overrideRoleId: z.string().min(1),
  status: z.enum(GUARDRAIL_STATUSES),
});

export const updateGuardrailRuleSchema = createGuardrailRuleSchema.partial();

export const guardrailIdParamSchema = z.object({ id: z.string().min(1) });

export const guardrailEventListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  tenantId: z.string().optional(),
  hours: z.coerce.number().optional(),
});

export const guardrailRuleListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});
