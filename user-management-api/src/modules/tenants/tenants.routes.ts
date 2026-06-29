import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireSuperAdmin, requireWorkspaceUser } from '../../common/middlewares/rbac.middleware';
import { validateBody, validateParams, validateQuery } from '../../common/validators/validate.middleware';
import { tenantController } from './tenants.controller';
import {
  createTenantSchema,
  tenantIdParamSchema,
  tenantListQuerySchema,
  updateTenantSchema,
} from './tenants.schema';

const router = Router();

router.use(authMiddleware);

router.get('/', requireWorkspaceUser, validateQuery(tenantListQuerySchema), tenantController.list);
router.get('/:id', requireWorkspaceUser, validateParams(tenantIdParamSchema), tenantController.getById);
router.post('/', requireSuperAdmin, validateBody(createTenantSchema), tenantController.create);
router.put('/:id', requireSuperAdmin, validateParams(tenantIdParamSchema), validateBody(updateTenantSchema), tenantController.update);
router.delete('/:id', requireSuperAdmin, validateParams(tenantIdParamSchema), tenantController.remove);

export default router;
