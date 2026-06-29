import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { isPlatformAdmin } from '../../common/utils/tenant-scope.util';
import { authService } from '../auth/auth.service';
import { auditService } from './audit.service';

export class AuditController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = { ...(req.query as Record<string, unknown>) };
      if (req.user && !isPlatformAdmin(req.user) && req.user.tenantId !== 'platform') {
        const profile = await authService.getProfileByUserId(req.user.id);
        query.tenant = profile.tenantName;
      }
      const result = await auditService.list(query as never);
      sendSuccess(res, result.items, 'Audit logs retrieved', 200, result.meta);
    } catch (err) {
      next(err);
    }
  };
}

export const auditController = new AuditController();
