import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/app.errors';

export function requireRoles(...allowedRoleIds: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError());
      return;
    }
    const hasRole = req.user.roleIds.some((id) => allowedRoleIds.includes(id));
    if (!hasRole) {
      next(new ForbiddenError('Insufficient role privileges'));
      return;
    }
    next();
  };
}

export function requirePermissions(...requiredPermissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError());
      return;
    }
    const hasPermission = requiredPermissions.every((p) => req.user!.permissions.includes(p));
    if (!hasPermission) {
      next(new ForbiddenError('Insufficient permissions'));
      return;
    }
    next();
  };
}

export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction): void {
  requireRoles('r-super', 'r-platform')(req, _res, next);
}

/** Any authenticated superadmin workspace user (platform, org, or tenant). */
export function requireWorkspaceUser(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new ForbiddenError());
    return;
  }
  next();
}
