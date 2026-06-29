import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requireSuperAdmin } from '../../common/middlewares/rbac.middleware';
import { dashboardController } from './dashboard.controller';

const router = Router();

router.use(authMiddleware, requireSuperAdmin);

/**
 * @openapi
 * /api/v1/superadmin/dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Platform KPI summary
 *     responses:
 *       200:
 *         description: Dashboard summary
 */
router.get('/summary', dashboardController.summary);
router.get('/top-tenants', dashboardController.topTenants);
router.get('/recent-activity', dashboardController.recentActivity);
router.get('/platform-health', dashboardController.platformHealth);

export default router;
