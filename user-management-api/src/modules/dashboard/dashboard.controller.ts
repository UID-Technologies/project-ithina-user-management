import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { dashboardService } from './dashboard.service';

export class DashboardController {
  summary = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await dashboardService.getSummary();
      sendSuccess(res, summary, 'Dashboard summary retrieved');
    } catch (err) {
      next(err);
    }
  };

  topTenants = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenants = await dashboardService.getTopTenants();
      sendSuccess(res, tenants, 'Top tenants retrieved');
    } catch (err) {
      next(err);
    }
  };

  recentActivity = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const activity = await dashboardService.getRecentActivity();
      sendSuccess(res, activity, 'Recent activity retrieved');
    } catch (err) {
      next(err);
    }
  };

  platformHealth = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const health = await dashboardService.getPlatformHealth();
      sendSuccess(res, health, 'Platform health retrieved');
    } catch (err) {
      next(err);
    }
  };
}

export const dashboardController = new DashboardController();
