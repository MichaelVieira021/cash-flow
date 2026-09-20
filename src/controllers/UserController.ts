import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { userService } from '../services/UserService';

export class UserController {
  static async create(req: Request, res: Response): Promise<void> {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  }

  static async login(req: Request, res: Response): Promise<void> {
    const response = await userService.verifyLogin(req.body);
    res.status(200).json(response);
  }

  static async getMe(req: Request, res: Response): Promise<void> {
    const userId = Number((req as AuthenticatedRequest).userId);
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  }

  static async getAll(_req: Request, res: Response): Promise<void> {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  }
}
