import { z } from 'zod';

import { Category } from '../models/Category';

export namespace CategorySchema {
  export const createSchema = z.object({
    name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
    userId: z.number().int().positive('userId inválido'),
    color: z.string().min(7, 'Cor deve ter ao menos 7 caracteres'),
    icon: z.string().min(1, 'Icon é obrigatório'),
  });
}

export namespace CategoryDto {
  export type Create = z.infer<typeof CategorySchema.createSchema>;

  export interface Response {
    id: number;
    name: string;
    userId: number;
    color: string;
    icon: string;
  }

  export interface AggregatesResponse extends Response {
    movementsCount: number;
    totalExpenses: number;
    totalIncomes: number;
  }

  export function toResponse(category: Category): Response {
    return {
      id: Number(category.id),
      name: category.name,
      userId: Number(category.userId),
      color: category.color,
      icon: category.icon,
    };
  }
}
