import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { env, Environment } from '../config/env';
import { AppError } from '../exceptions/AppError';

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const error = err instanceof Error ? err : new Error(String(err));
  const isDevelopment = env.NODE_ENV === Environment.DEVELOPMENT;

  if (err instanceof ZodError) {
    res.status(400).json({
      status: 400,
      title: 'Dados inválidos',
      detail: 'Um ou mais campos estão inválidos',
      timestamp: new Date().toISOString(),
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({
      status: err.status,
      title: err.title,
      detail: err.message,
      timestamp: new Date().toISOString(),
      ...(err.errors ? { errors: err.errors } : {}),
    });
    return;
  }

  console.error('Erro interno:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    path: _req.path,
    method: _req.method,
  });

  res.status(500).json({
    status: 500,
    title: 'Erro interno do servidor',
    detail: isDevelopment ? error.message : 'Erro interno do servidor',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && error.stack ? { stack: error.stack } : {}),
  });
}
