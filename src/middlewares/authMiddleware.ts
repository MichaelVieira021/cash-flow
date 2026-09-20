import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { env } from '../config/env';
import { UserRole } from '../enums/UserRole';
import { ForbiddenError, UnauthorizedError } from '../exceptions';

const AuthPayloadSchema = z.object({
  userId: z.number(),
  login: z.string(),
  role: z.nativeEnum(UserRole),
});

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;

export interface AuthenticatedRequest extends Request {
  userId: number;
  login: string;
  role: UserRole;
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next(new UnauthorizedError('Token não informado'));
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = AuthPayloadSchema.parse(jwt.verify(token, env.JWT_SECRET));
    const authReq = req as AuthenticatedRequest;
    authReq.userId = decoded.userId;
    authReq.login = decoded.login;
    authReq.role = decoded.role;
    next();
  } catch {
    next(new UnauthorizedError('Token inválido ou expirado'));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;
  if (authReq.role !== UserRole.ADMIN) {
    next(new ForbiddenError('Apenas administradores podem acessar este recurso'));
    return;
  }
  next();
}

export function requireSelfOrAdmin(req: Request, _res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;
  const pathUserId = Number(req.params.userId);

  if (Number.isNaN(pathUserId)) {
    next(new ForbiddenError('userId inválido'));
    return;
  }

  if (authReq.role === UserRole.ADMIN || Number(authReq.userId) === pathUserId) {
    next();
    return;
  }

  next(new ForbiddenError('Você só pode acessar os próprios dados'));
}
