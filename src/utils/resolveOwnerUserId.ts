import { Request } from 'express';

import { UserRole } from '../enums/UserRole';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export function resolveOwnerUserId(req: Request, bodyUserId?: number): number {
  const request = req as AuthenticatedRequest;
  if (request.role === UserRole.ADMIN && bodyUserId) {
    return bodyUserId;
  }
  return Number(request.userId);
}
