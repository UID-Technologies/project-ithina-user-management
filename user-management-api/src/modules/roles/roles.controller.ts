import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { getParam } from '../../common/utils/params.util';
import { enforceTenantScope, canAccessTenant, isPlatformAdmin } from '../../common/utils/tenant-scope.util';
import { ForbiddenError } from '../../common/errors/app.errors';
import { roleService } from './roles.service';

export class RoleController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = enforceTenantScope(req.user, req.query as Record<string, unknown>);
      const result = await roleService.list(query as never);
      const items = isPlatformAdmin(req.user!)
        ? result.items
        : result.items.filter((r) => r.type !== 'Platform');
      sendSuccess(res, items, 'Roles retrieved', 200, { ...result.meta, total: items.length });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = await roleService.getById(getParam(req, 'id'));
      if (
        !isPlatformAdmin(req.user!) &&
        (role.type === 'Platform' || (role.tenantId && !canAccessTenant(req.user, role.tenantId)))
      ) {
        next(new ForbiddenError('Role not in your workspace scope'));
        return;
      }
      sendSuccess(res, role, 'Role retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = await roleService.create(req.body, req.user?.name);
      sendSuccess(res, role, 'Role created', 201);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = await roleService.update(getParam(req, 'id'), req.body, req.user?.name);
      sendSuccess(res, role, 'Role updated');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await roleService.remove(getParam(req, 'id'), req.user?.name);
      sendSuccess(res, null, 'Role deleted');
    } catch (err) {
      next(err);
    }
  };
}

export const roleController = new RoleController();
