import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { getParam } from '../../common/utils/params.util';
import { enforceTenantScope, canAccessTenant } from '../../common/utils/tenant-scope.util';
import { ForbiddenError } from '../../common/errors/app.errors';
import { tenantService } from './tenants.service';

export class TenantController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = enforceTenantScope(req.user, req.query as Record<string, unknown>);
      const result = await tenantService.list(query as never);
      sendSuccess(res, result.items, 'Tenants retrieved', 200, result.meta);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParam(req, 'id');
      if (!canAccessTenant(req.user, id)) {
        next(new ForbiddenError('Tenant not in your workspace scope'));
        return;
      }
      const tenant = await tenantService.getById(id);
      sendSuccess(res, tenant, 'Tenant retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenant = await tenantService.create(req.body, req.user?.name);
      sendSuccess(res, tenant, 'Tenant created', 201);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenant = await tenantService.update(getParam(req, 'id'), req.body, req.user?.name);
      sendSuccess(res, tenant, 'Tenant updated');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await tenantService.remove(getParam(req, 'id'), req.user?.name);
      sendSuccess(res, null, 'Tenant deleted');
    } catch (err) {
      next(err);
    }
  };
}

export const tenantController = new TenantController();
