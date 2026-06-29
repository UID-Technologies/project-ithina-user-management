import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { getQueryString, getParam } from '../../common/utils/params.util';
import { isPlatformAdmin, canAccessTenant } from '../../common/utils/tenant-scope.util';
import { ForbiddenError } from '../../common/errors/app.errors';
import { organizationService } from './organizations.service';
import type { CreateLocationDto } from './organizations.types';

function resolveTenantId(req: Request): string {
  if (req.user && !isPlatformAdmin(req.user) && req.user.tenantId !== 'platform') {
    return req.user.tenantId;
  }
  return getQueryString(req, 'tenantId');
}

export class OrganizationController {
  listFlat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = resolveTenantId(req);
      const locations = await organizationService.listFlat(tenantId);
      sendSuccess(res, locations, 'Locations retrieved');
    } catch (err) {
      next(err);
    }
  };

  getTree = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = resolveTenantId(req);
      const tree = await organizationService.getTree(tenantId);
      sendSuccess(res, tree, 'Organization tree retrieved');
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loc = await organizationService.getById(getParam(req, 'id'));
      if (!canAccessTenant(req.user, loc.tenantId)) {
        next(new ForbiddenError('Location not in your workspace scope'));
        return;
      }
      sendSuccess(res, loc, 'Location retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreateLocationDto;
      if (req.user && !canAccessTenant(req.user, body.tenantId)) {
        next(new ForbiddenError('Cannot create org nodes outside your workspace'));
        return;
      }
      const loc = await organizationService.create(body, req.user?.name);
      sendSuccess(res, loc, 'Location created', 201);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParam(req, 'id');
      const existing = await organizationService.getById(id);
      if (!canAccessTenant(req.user, existing.tenantId)) {
        next(new ForbiddenError('Location not in your workspace scope'));
        return;
      }
      const loc = await organizationService.update(id, req.body, req.user?.name);
      sendSuccess(res, loc, 'Location updated');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParam(req, 'id');
      const existing = await organizationService.getById(id);
      if (!canAccessTenant(req.user, existing.tenantId)) {
        next(new ForbiddenError('Location not in your workspace scope'));
        return;
      }
      await organizationService.remove(id, req.user?.name);
      sendSuccess(res, null, 'Location deleted');
    } catch (err) {
      next(err);
    }
  };
}

export const organizationController = new OrganizationController();
