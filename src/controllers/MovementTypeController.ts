import { Request, Response } from 'express';

import { movementTypeService } from '../services/MovementTypeService';

export class MovementTypeController {
  static async getAll(_req: Request, res: Response): Promise<void> {
    const types = await movementTypeService.getAll();
    res.status(200).json(types);
  }
}
