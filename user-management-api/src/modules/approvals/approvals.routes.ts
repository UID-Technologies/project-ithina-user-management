import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireSuperAdmin } from '../../common/middlewares/rbac.middleware';
import { validateQuery } from '../../common/validators/validate.middleware';
import { approvalController } from './approvals.controller';
import { approvalListQuerySchema } from './approvals.schema';

const router = Router();

router.use(authMiddleware, requireSuperAdmin);

router.get('/', validateQuery(approvalListQuerySchema), approvalController.list);

export default router;
