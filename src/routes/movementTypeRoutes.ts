import { Router } from 'express';

import { MovementTypeController } from '../controllers/MovementTypeController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(MovementTypeController.getAll));

export default router;
