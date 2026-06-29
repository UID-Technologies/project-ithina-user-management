import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireSuperAdmin, requireWorkspaceUser } from '../../common/middlewares/rbac.middleware';import { validateBody, validateParams, validateQuery } from '../../common/validators/validate.middleware';
import { userController } from './users.controller';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  userListQuerySchema,
} from './users.schema';

const router = Router();

router.use(authMiddleware);

router.get('/', requireWorkspaceUser, validateQuery(userListQuerySchema), userController.list);
router.get('/:id', requireWorkspaceUser, validateParams(userIdParamSchema), userController.getById);
router.post('/', requireSuperAdmin, validateBody(createUserSchema), userController.create);
router.put('/:id', requireSuperAdmin, validateParams(userIdParamSchema), validateBody(updateUserSchema), userController.update);
router.delete('/:id', requireSuperAdmin, validateParams(userIdParamSchema), userController.remove);

export default router;
