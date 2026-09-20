import { Op, QueryTypes } from 'sequelize';

import { sequelize } from '../config/database';
import { CategoryDto } from '../dtos/category';
import { Category, CategoryCreationAttributes } from '../models/Category';

export class CategoryRepository {
  async create(data: CategoryCreationAttributes): Promise<Category> {
    return await Category.create(data);
  }

  async findAll(): Promise<Category[]> {
    return await Category.findAll();
  }

  async findAllByUserId(userId: number): Promise<Category[]> {
    return await Category.findAll({ where: { userId } });
  }

  async existsByIdAndUserId(categoryId: number, userId: number): Promise<boolean> {
    const count = await Category.count({ where: { id: categoryId, userId } });
    return count > 0;
  }

  async existsByNameInUser(name: string, userId: number): Promise<boolean> {
    const count = await Category.count({
      where: {
        userId,
        name: { [Op.iLike]: name },
      },
    });
    return count > 0;
  }

  async findAllByUserWithMovementAggregates(
    userId: number,
  ): Promise<CategoryDto.AggregatesResponse[]> {
    return await sequelize.query<CategoryDto.AggregatesResponse>(
      `
        SELECT
          cat.id::int,
          cat.name,
          cat.user_id::int AS userId,
          cat.color,
          cat.icon,
          COUNT(mov.id)::int AS movementsCount,
          COALESCE(SUM(CASE WHEN mov.type_id = 2 THEN mov.amount ELSE 0 END), 0)::float AS totalExpenses,
          COALESCE(SUM(CASE WHEN mov.type_id = 1 THEN mov.amount ELSE 0 END), 0)::float AS totalIncomes
        FROM categories cat
        LEFT JOIN movements mov ON cat.id = mov.category_id
        WHERE cat.user_id = :userId
        GROUP BY cat.id, cat.name, cat.user_id, cat.color, cat.icon;
      `,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      },
    );
  }
}

export const categoryRepository = new CategoryRepository();
