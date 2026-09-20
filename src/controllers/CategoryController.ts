import { Request, Response } from 'express';

import { categoryService } from '../services/CategoryService';

export class CategoryController {
  static async create(req: Request, res: Response): Promise<void> {
    // const userId = resolveOwnerUserId(req, req.body.user_id);
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  }

  static async getAll(_req: Request, res: Response): Promise<void> {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  }

  static async getByUser(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.userId);

    const categories = await categoryService.getAllCategoriesByUser(userId);
    res.status(200).json(categories);
  }

  static async getByUserComplete(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.userId);
    const categories = await categoryService.getAllCategoriesByUserWithCountMovements(userId);
    res.status(200).json(categories);
  }
}
