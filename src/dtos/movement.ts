import { z } from 'zod';

import { Movement } from '../models/Movement';

export namespace MovementSchema {
  export const createSchema = z.object({
    typeId: z.number().int().positive('typeId inválido'),
    amount: z.number().positive('Valor deve ser positivo'),
    description: z.string().min(3, 'Descrição deve ter ao menos 3 caracteres'),
    date: z.coerce.date(),
    userId: z.number().int().positive('userId inválido'),
    categoryId: z.number().int().positive('categoryId inválido'),
    paymentMethodId: z.number().int().positive('paymentMethodId inválido'),
  });
}

export namespace MovementDto {
  export type Create = z.infer<typeof MovementSchema.createSchema>;

  export interface Response {
    id: number;
    typeId: number;
    amount: number;
    description: string;
    date: Date;
    paymentMethodId: number;
    userId: number;
    categoryId: number;
  }

  export interface MonthSummaryResponse {
    totalIncome: number;
    totalExpense: number;
    totalBalance: number;
    incomePercentageChange: number;
    expensePercentageChange: number;
    balancePercentageChange: number;
  }

  export interface MonthDataResponse {
    month: string;
    income: number;
    expense: number;
    net: number;
  }

  export interface YearSummaryResponse {
    totalBalance: number;
    monthlyData: MonthDataResponse[];
    period: number;
  }

  export function toResponse(movement: Movement): Response {
    return {
      id: Number(movement.id),
      typeId: Number(movement.typeId),
      amount: Number(movement.amount),
      description: movement.description,
      date: movement.date,
      paymentMethodId: Number(movement.paymentMethodId),
      userId: Number(movement.userId),
      categoryId: Number(movement.categoryId),
    };
  }
}
