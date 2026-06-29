import { Request } from 'express';

export function getParam(req: Request, key: string): string {
  const value = req.params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

export function getQueryString(req: Request, key: string): string {
  const value = req.query[key];
  if (Array.isArray(value)) return String(value[0]);
  return String(value ?? '');
}
