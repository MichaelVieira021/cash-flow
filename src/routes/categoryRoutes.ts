import { Router } from 'express';

import { CategoryController } from '../controllers/CategoryController';
import { CategorySchema } from '../dtos/category';
import { requireAdmin, requireSelfOrAdmin } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', validate(CategorySchema.createSchema), asyncHandler(CategoryController.create));

router.get('/', requireAdmin, asyncHandler(CategoryController.getAll));

router.get('/user/:userId/all', requireSelfOrAdmin, asyncHandler(CategoryController.getByUser));

router.get(
  '/user/:userId/all/complete',
  requireSelfOrAdmin,
  asyncHandler(CategoryController.getByUserComplete),
);

export default router;
