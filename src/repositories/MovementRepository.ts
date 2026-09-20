import { Op, QueryTypes } from 'sequelize';

import { sequelize } from '../config/database';
import { MovementDto } from '../dtos/movement';
import { Movement, MovementCreationAttributes } from '../models';

function monthDateRange(year: number, month: number): { dateStart: Date; dateEnd: Date } {
  return {
    dateStart: new Date(year, month - 1, 1),
    dateEnd: new Date(year, month, 0),
  };
}

export class MovementRepository {
  async create(data: MovementCreationAttributes): Promise<Movement> {
    return await Movement.create(data);
  }

  async findById(id: number): Promise<Movement | null> {
    return await Movement.findByPk(id);
  }

  async findAllByUserId(userId: number): Promise<Movement[]> {
    return await Movement.findAll({ where: { userId } });
  }

  async findAllByUserMonthYear(userId: number, month: number, year: number): Promise<Movement[]> {
    const { dateStart, dateEnd } = monthDateRange(year, month);
    return await Movement.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [dateStart, dateEnd],
        },
      },
    });
  }

  async sumAmountByType(
    userId: number,
    month: number,
    year: number,
    typeId: number,
  ): Promise<number> {
    const { dateStart, dateEnd } = monthDateRange(year, month);
    return Number(
      (await Movement.sum('amount', {
        where: { userId, typeId, date: { [Op.between]: [dateStart, dateEnd] } },
      })) ?? 0,
    );
  }

  async getSummaryForMonth(
    userId: number,
    month: number,
    year: number,
  ): Promise<{ income: number; expense: number }> {
    const result = await sequelize.query<{ income: number; expense: number }>(
      `
        SELECT
          COALESCE(SUM(CASE WHEN mov.type_id = 1 THEN mov.amount ELSE 0 END)::float, 0) AS income,
          COALESCE(SUM(CASE WHEN mov.type_id = 2 THEN mov.amount ELSE 0 END)::float, 0) AS expense
        FROM movements mov
        WHERE mov.user_id = :userId
          AND EXTRACT(YEAR FROM mov.date) = :year
          AND EXTRACT(MONTH FROM mov.date) = :month
      `,
      {
        replacements: { userId, year, month },
        type: QueryTypes.SELECT,
      },
    );

    return result[0];
  }

  async getYearSummary(userId: number, year: number): Promise<MovementDto.MonthDataResponse[]> {
    const MONTH_NAMES = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ] as const;

    const rows = await sequelize.query<MovementDto.MonthDataResponse>(
      `
      SELECT
        EXTRACT(MONTH FROM mov.date)::int AS month,
        SUM(CASE WHEN mov.type_id = 1 THEN mov.amount ELSE 0 END)::float AS income,
        SUM(CASE WHEN mov.type_id = 2 THEN mov.amount ELSE 0 END)::float AS expense
      FROM movements mov
      WHERE mov.user_id = :userId
        AND EXTRACT(YEAR FROM mov.date) = :year
      GROUP BY EXTRACT(MONTH FROM mov.date)
      ORDER BY month
    `,
      { replacements: { userId, year }, type: QueryTypes.SELECT },
    );

    const monthlyData: MovementDto.MonthDataResponse[] = Array.from({ length: 12 }, (_, i) => {
      const data = rows.find((r: MovementDto.MonthDataResponse) => r.month === i + 1);

      return {
        month: MONTH_NAMES[i],
        income: data?.income ?? 0,
        expense: data?.expense ?? 0,
        net: (data?.income ?? 0) - (data?.expense ?? 0),
      };
    });

    return monthlyData;
  }
}

export const movementRepository = new MovementRepository();
