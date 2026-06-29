import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireSuperAdmin, requireWorkspaceUser } from '../../common/middlewares/rbac.middleware';
import { validateBody, validateParams } from '../../common/validators/validate.middleware';
import { moduleAccessController } from './module-access.controller';
import { patchModuleAccessSchema, tenantIdParamSchema, toggleModuleAccessSchema } from './module-access.schema';

const router = Router();

router.use(authMiddleware);

router.get('/modules', requireWorkspaceUser, moduleAccessController.listModules);
router.get('/', requireSuperAdmin, moduleAccessController.listAll);
router.get('/:tenantId', requireWorkspaceUser, validateParams(tenantIdParamSchema), moduleAccessController.getByTenant);
router.patch(
  '/:tenantId/toggle',
  requireSuperAdmin,
  validateParams(tenantIdParamSchema),
  validateBody(toggleModuleAccessSchema),
  moduleAccessController.toggle,
);
router.patch(
  '/:tenantId',
  requireSuperAdmin,
  validateParams(tenantIdParamSchema),
  validateBody(patchModuleAccessSchema),
  moduleAccessController.patch,
);

export default router;
