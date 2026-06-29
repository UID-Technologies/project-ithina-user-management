import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireWorkspaceUser } from '../../common/middlewares/rbac.middleware';
import { validateQuery } from '../../common/validators/validate.middleware';
import { permissionController } from './permissions.controller';
import { permissionListQuerySchema } from './permissions.schema';

const router = Router();

router.use(authMiddleware);

router.get('/', requireWorkspaceUser, validateQuery(permissionListQuerySchema), permissionController.list);
router.get('/role-map', requireWorkspaceUser, permissionController.roleMap);

export default router;
