import { Request, Response } from 'express';

import { paymentMethodService } from '../services/PaymentMethodService';

export class PaymentMethodController {
  static async getAll(_req: Request, res: Response): Promise<void> {
    const methods = await paymentMethodService.getAll();
    res.status(200).json(methods);
  }
}
