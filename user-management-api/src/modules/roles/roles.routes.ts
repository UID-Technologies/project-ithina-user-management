import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireSuperAdmin, requireWorkspaceUser } from '../../common/middlewares/rbac.middleware';
import { validateBody, validateParams, validateQuery } from '../../common/validators/validate.middleware';
import { roleController } from './roles.controller';
import {
  createRoleSchema,
  roleIdParamSchema,
  roleListQuerySchema,
  updateRoleSchema,
} from './roles.schema';

const router = Router();

router.use(authMiddleware);

router.get('/', requireWorkspaceUser, validateQuery(roleListQuerySchema), roleController.list);
router.get('/:id', requireWorkspaceUser, validateParams(roleIdParamSchema), roleController.getById);
router.post('/', requireSuperAdmin, validateBody(createRoleSchema), roleController.create);
router.put('/:id', requireSuperAdmin, validateParams(roleIdParamSchema), validateBody(updateRoleSchema), roleController.update);
router.delete('/:id', requireSuperAdmin, validateParams(roleIdParamSchema), roleController.remove);

export default router;
