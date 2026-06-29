import { NextFunction, Request, Response } from 'express';
import pinoHttp from 'pino-http';
import { logger } from '../../config/logger.config';

export const requestLoggerMiddleware = pinoHttp({
  logger,
  customProps: (req: Request) => ({ correlationId: req.correlationId }),
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      correlationId: req.correlationId,
    }),
  },
});

export function notFoundMiddleware(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err.name === 'AppError') {
    const appErr = err as { statusCode?: number; errors?: unknown[] };
    res.status(appErr.statusCode ?? 500).json({
      success: false,
      message: err.message,
      errors: appErr.errors,
    });
    return;
  }

  if (err.name === 'ZodError') {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: (err as { issues?: unknown[] }).issues,
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: 'Invalid identifier' });
    return;
  }

  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ success: false, message: 'Internal server error' });
}
