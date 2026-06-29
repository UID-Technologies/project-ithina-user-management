import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireWorkspaceUser } from '../../common/middlewares/rbac.middleware';
import { validateQuery } from '../../common/validators/validate.middleware';
import { auditController } from './audit.controller';
import { auditListQuerySchema } from './audit.schema';

const router = Router();

router.use(authMiddleware, requireWorkspaceUser);

router.get('/', validateQuery(auditListQuerySchema), auditController.list);

export default router;
