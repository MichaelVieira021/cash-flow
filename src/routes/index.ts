import { Router } from 'express';

import { env } from '../config/env';
import { authMiddleware } from '../middlewares/authMiddleware';
import categoryRoutes from './categoryRoutes';
import movementRoutes from './movementRoutes';
import movementTypeRoutes from './movementTypeRoutes';
import paymentMethodRoutes from './paymentMethodRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/categories', authMiddleware, categoryRoutes);
router.use('/movement', authMiddleware, movementRoutes);
router.use('/movement-types', authMiddleware, movementTypeRoutes);
router.use('/payment-methods', authMiddleware, paymentMethodRoutes);
router.get('/health', (req, res) => {
  res.json({ status: 'OK', environment: env.NODE_ENV });
});

export default router;
