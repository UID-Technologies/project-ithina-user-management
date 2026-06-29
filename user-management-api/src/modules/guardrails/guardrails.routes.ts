import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireSuperAdmin } from '../../common/middlewares/rbac.middleware';
import { validateBody, validateParams, validateQuery } from '../../common/validators/validate.middleware';
import { guardrailController } from './guardrails.controller';
import {
  createGuardrailRuleSchema,
  guardrailEventListQuerySchema,
  guardrailIdParamSchema,
  guardrailRuleListQuerySchema,
  updateGuardrailRuleSchema,
} from './guardrails.schema';

const router = Router();

router.use(authMiddleware, requireSuperAdmin);

router.get('/rules', validateQuery(guardrailRuleListQuerySchema), guardrailController.listRules);
router.get('/rules/:id', validateParams(guardrailIdParamSchema), guardrailController.getRuleById);
router.post('/rules', validateBody(createGuardrailRuleSchema), guardrailController.createRule);
router.put(
  '/rules/:id',
  validateParams(guardrailIdParamSchema),
  validateBody(updateGuardrailRuleSchema),
  guardrailController.updateRule,
);
router.delete('/rules/:id', validateParams(guardrailIdParamSchema), guardrailController.removeRule);
router.get('/events', validateQuery(guardrailEventListQuerySchema), guardrailController.listEvents);

export default router;
