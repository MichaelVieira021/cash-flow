import { Router } from 'express';

import { PaymentMethodController } from '../controllers/PaymentMethodController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(PaymentMethodController.getAll));

export default router;
