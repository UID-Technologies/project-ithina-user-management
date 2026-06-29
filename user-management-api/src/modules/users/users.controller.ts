import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { getParam } from '../../common/utils/params.util';
import { enforceTenantScope, canAccessTenant } from '../../common/utils/tenant-scope.util';
import { ForbiddenError } from '../../common/errors/app.errors';
import { userService } from './users.service';

export class UserController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = enforceTenantScope(req.user, req.query as Record<string, unknown>);
      const result = await userService.list(query as never);
      sendSuccess(res, result.items, 'Users retrieved', 200, result.meta);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParam(req, 'id');
      const user = await userService.getById(id);
      if (!canAccessTenant(req.user, user.tenantId) && req.user?.id !== id) {
        next(new ForbiddenError('User not in your workspace scope'));
        return;
      }
      sendSuccess(res, user, 'User retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.create(req.body, req.user?.name);
      sendSuccess(res, user, 'User created', 201);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.update(getParam(req, 'id'), req.body, req.user?.name);
      sendSuccess(res, user, 'User updated');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userService.remove(getParam(req, 'id'), req.user?.name);
      sendSuccess(res, null, 'User deleted');
    } catch (err) {
      next(err);
    }
  };
}

export const userController = new UserController();
