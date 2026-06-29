import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { getParam } from '../../common/utils/params.util';
import { canAccessTenant } from '../../common/utils/tenant-scope.util';
import { ForbiddenError } from '../../common/errors/app.errors';
import { moduleAccessService } from './module-access.service';

export class ModuleAccessController {
  listModules = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const modules = await moduleAccessService.listModules();
      sendSuccess(res, modules, 'Modules retrieved');
    } catch (err) {
      next(err);
    }
  };

  listAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const access = await moduleAccessService.listAllTenantAccess();
      sendSuccess(res, access, 'Tenant module access retrieved');
    } catch (err) {
      next(err);
    }
  };

  getByTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = getParam(req, 'tenantId');
      if (!canAccessTenant(req.user, tenantId)) {
        next(new ForbiddenError('Tenant not in your workspace scope'));
        return;
      }
      const access = await moduleAccessService.getTenantAccess(tenantId);
      sendSuccess(res, access, 'Tenant module access retrieved');
    } catch (err) {
      next(err);
    }
  };

  patch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const access = await moduleAccessService.patchTenantAccess(
        getParam(req, 'tenantId'),
        req.body,
        req.user?.name,
      );
      sendSuccess(res, access, 'Module access updated');
    } catch (err) {
      next(err);
    }
  };

  toggle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { module, enabled } = req.body as { module: string; enabled: boolean };
      const access = await moduleAccessService.toggleModule(
        getParam(req, 'tenantId'),
        module as never,
        enabled,
        req.user?.name,
      );
      sendSuccess(res, access, 'Module toggled');
    } catch (err) {
      next(err);
    }
  };
}

export const moduleAccessController = new ModuleAccessController();
