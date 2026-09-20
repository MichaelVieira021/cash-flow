import { CategoryDto } from '../dtos/category';
import { AppError } from '../exceptions/AppError';
import { NotFoundError } from '../exceptions/NotFoundError';
import { categoryRepository } from '../repositories/CategoryRepository';
import { userService } from './UserService';

export class CategoryService {
  async createCategory(dto: CategoryDto.Create): Promise<CategoryDto.Response> {
    await this.verifyNameInUse(dto.name, dto.userId);

    const category = await categoryRepository.create({
      name: dto.name,
      userId: dto.userId,
      color: dto.color,
      icon: dto.icon,
    });
    return CategoryDto.toResponse(category);
  }

  async getAllCategories(): Promise<CategoryDto.Response[]> {
    const categories = await categoryRepository.findAll();
    return categories.map(CategoryDto.toResponse);
  }

  async getAllCategoriesByUser(userId: number): Promise<CategoryDto.Response[]> {
    await userService.getUserById(userId);
    const categories = await categoryRepository.findAllByUserId(userId);
    return categories.map(CategoryDto.toResponse);
  }

  async getAllCategoriesByUserWithCountMovements(
    userId: number,
  ): Promise<CategoryDto.AggregatesResponse[]> {
    await userService.getUserById(userId);
    const results = await categoryRepository.findAllByUserWithMovementAggregates(userId);
    return results;
  }

  async validateCategoryByUser(categoryId: number, userId: number): Promise<void> {
    const exists = await categoryRepository.existsByIdAndUserId(categoryId, userId);
    if (!exists) {
      throw new NotFoundError('Categoria não encontrada');
    }
  }

  private async verifyNameInUse(name: string, userId: number): Promise<void> {
    await userService.getUserById(userId);
    const exists = await categoryRepository.existsByNameInUser(name, userId);
    if (exists) {
      throw new AppError(409, 'Recurso duplicado', 'Categoria já existe');
    }
  }
}

export const categoryService = new CategoryService();
