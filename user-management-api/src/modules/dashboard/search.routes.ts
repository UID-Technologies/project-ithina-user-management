import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireSuperAdmin } from '../../common/middlewares/rbac.middleware';
import { searchController } from './search.controller';

const router = Router();

router.use(authMiddleware, requireSuperAdmin);
router.get('/', searchController.global);

export default router;
