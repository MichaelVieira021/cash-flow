import { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { UserSchema } from '../dtos/user';
import { authMiddleware, requireAdmin } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', validate(UserSchema.createSchema), asyncHandler(UserController.create));

router.post('/login', validate(UserSchema.loginSchema), asyncHandler(UserController.login));

router.get('/me', authMiddleware, asyncHandler(UserController.getMe));

router.get('/', authMiddleware, requireAdmin, asyncHandler(UserController.getAll));

export default router;
