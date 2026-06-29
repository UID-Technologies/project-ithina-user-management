import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { permissionService } from './permissions.service';

export class PermissionController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await permissionService.list(req.query as never);
      sendSuccess(res, result.items, 'Permissions retrieved', 200, result.meta);
    } catch (err) {
      next(err);
    }
  };

  roleMap = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const map = await permissionService.getRolePermissionMap();
      sendSuccess(res, map, 'Role permission map retrieved');
    } catch (err) {
      next(err);
    }
  };
}

export const permissionController = new PermissionController();
