import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireWorkspaceUser } from '../../common/middlewares/rbac.middleware';
import { validateBody, validateParams, validateQuery } from '../../common/validators/validate.middleware';
import { organizationController } from './organizations.controller';
import {
  createLocationSchema,
  locationIdParamSchema,
  orgTreeQuerySchema,
  updateLocationSchema,
} from './organizations.schema';

const router = Router();

router.use(authMiddleware);

router.get('/', requireWorkspaceUser, validateQuery(orgTreeQuerySchema), organizationController.listFlat);
router.get('/tree', requireWorkspaceUser, validateQuery(orgTreeQuerySchema), organizationController.getTree);
router.get('/:id', requireWorkspaceUser, validateParams(locationIdParamSchema), organizationController.getById);
router.post('/', requireWorkspaceUser, validateBody(createLocationSchema), organizationController.create);
router.put('/:id', requireWorkspaceUser, validateParams(locationIdParamSchema), validateBody(updateLocationSchema), organizationController.update);
router.delete('/:id', requireWorkspaceUser, validateParams(locationIdParamSchema), organizationController.remove);

export default router;
