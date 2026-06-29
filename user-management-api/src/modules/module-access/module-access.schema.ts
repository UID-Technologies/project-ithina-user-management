import { z } from 'zod';
import { MODULE_KEYS } from '../../common/enums';

export const tenantIdParamSchema = z.object({ tenantId: z.string().min(1) });

export const patchModuleAccessSchema = z.object({
  enabledModules: z.array(z.enum(MODULE_KEYS)),
});

export const toggleModuleAccessSchema = z.object({
  module: z.enum(MODULE_KEYS),
  enabled: z.boolean(),
});
