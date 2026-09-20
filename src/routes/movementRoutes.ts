import { Router } from 'express';

import { MovementController } from '../controllers/MovementController';
import { MovementSchema } from '../dtos/movement';
import { requireSelfOrAdmin } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', validate(MovementSchema.createSchema), asyncHandler(MovementController.create));

router.get('/user/:userId/all', requireSelfOrAdmin, asyncHandler(MovementController.getAllByUser));

router.get(
  '/user/:userId/summary/year/:year',
  requireSelfOrAdmin,
  asyncHandler(MovementController.getYearSummary),
);

router.get(
  '/user/:userId/summary',
  requireSelfOrAdmin,
  asyncHandler(MovementController.getMonthSummary),
);

router.get('/user/:userId', requireSelfOrAdmin, asyncHandler(MovementController.getByMonthAndYear));

export default router;
