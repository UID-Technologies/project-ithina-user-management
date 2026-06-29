import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config';
import { AuthUser } from '../interfaces/api.interface';
import { UnauthorizedError } from '../errors/app.errors';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  roleIds: string[];
  tenantId: string | 'platform';
  permissions: string[];
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new UnauthorizedError('Missing or invalid authorization header'));
    return;
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      roleIds: decoded.roleIds,
      tenantId: decoded.tenantId,
      permissions: decoded.permissions,
    } satisfies AuthUser;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next();
    return;
  }
  authMiddleware(req, _res, next);
}
