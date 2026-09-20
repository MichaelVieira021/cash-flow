import { MovementDto } from '../dtos/movement';
import { movementRepository } from '../repositories/MovementRepository';
import { categoryService } from './CategoryService';
import { movementTypeService } from './MovementTypeService';
import { paymentMethodService } from './PaymentMethodService';
import { userService } from './UserService';

export function calculatePercentageChange(previous: number, current: number): number {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return current > 0 ? 100 : -100;

  const percentageChange = ((current - previous) / previous) * 100;
  return Number(percentageChange.toFixed(2));
}

export class MovementService {
  async createMovement(dto: MovementDto.Create): Promise<MovementDto.Response> {
    await userService.getUserById(dto.userId);
    await categoryService.validateCategoryByUser(dto.categoryId, dto.userId);
    await movementTypeService.validateById(dto.typeId);
    await paymentMethodService.validateById(dto.paymentMethodId);
    const movement = await movementRepository.create(dto);
    return MovementDto.toResponse(movement);
  }

  async getAllMovementByUser(userId: number): Promise<MovementDto.Response[]> {
    const movements = await movementRepository.findAllByUserId(userId);
    return movements.map(MovementDto.toResponse);
  }

  async getAllMovementByMonthAndYear(
    userId: number,
    month: number,
    year: number,
  ): Promise<MovementDto.Response[]> {
    const movements = await movementRepository.findAllByUserMonthYear(userId, month, year);
    return movements.map(MovementDto.toResponse);
  }

  async getMonthSummary(
    userId: number,
    month: number,
    year: number,
  ): Promise<MovementDto.MonthSummaryResponse> {
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;

    const [current, previous] = await Promise.all([
      movementRepository.getSummaryForMonth(userId, month, year),
      movementRepository.getSummaryForMonth(userId, previousMonth, previousYear),
    ]);

    const totalBalance = current.income - current.expense;
    const previousBalance = previous.income - previous.expense;

    return {
      totalIncome: current.income,
      totalExpense: current.expense,
      totalBalance,
      incomePercentageChange: calculatePercentageChange(previous.income, current.income),
      expensePercentageChange: calculatePercentageChange(previous.expense, current.expense),
      balancePercentageChange: calculatePercentageChange(previousBalance, totalBalance),
    };
  }

  async getYearSummary(userId: number, year: number): Promise<MovementDto.YearSummaryResponse> {
    const monthlyData = await movementRepository.getYearSummary(userId, year);
    const totalBalance = monthlyData.reduce((sum, m) => sum + m.net, 0);
    return { totalBalance, monthlyData, period: year };
  }
}

export const movementService = new MovementService();
