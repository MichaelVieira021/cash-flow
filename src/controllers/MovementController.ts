import { Request, Response } from 'express';

import { movementService } from '../services/MovementService';
import { resolveOwnerUserId } from '../utils/resolveOwnerUserId';

export class MovementController {
  static async create(req: Request, res: Response): Promise<void> {
    const userId = resolveOwnerUserId(req, req.body.user_id);
    const movement = await movementService.createMovement({ ...req.body, user_id: userId });
    res.status(201).json(movement);
  }

  static async getAllByUser(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.userId);
    const movements = await movementService.getAllMovementByUser(userId);
    res.status(200).json(movements);
  }

  static async getByMonthAndYear(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.userId);
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    const movements = await movementService.getAllMovementByMonthAndYear(userId, month, year);
    res.status(200).json(movements);
  }

  static async getMonthSummary(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.userId);
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    const summary = await movementService.getMonthSummary(userId, month, year);
    res.status(200).json(summary);
  }

  static async getYearSummary(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.userId);
    const year = Number(req.params.year);
    const summary = await movementService.getYearSummary(userId, year);
    res.status(200).json(summary);
  }
}
