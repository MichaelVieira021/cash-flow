import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../config/database';
import { AuditAttributes } from './audit';
import type { Category } from './Category';
import type { Models } from './index';
import type { MovementType } from './MovementType';
import type { PaymentMethod } from './PaymentMethod';
import type { User } from './User';

export interface MovementAttributes extends AuditAttributes {
  id: number;
  typeId: number;
  amount: number;
  description: string;
  date: Date;
  paymentMethodId: number;
  userId: number;
  categoryId: number;
}

export type MovementCreationAttributes = Optional<
  MovementAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class Movement
  extends Model<MovementAttributes, MovementCreationAttributes>
  implements MovementAttributes
{
  declare id: number;
  declare typeId: number;
  declare amount: number;
  declare description: string;
  declare date: Date;
  declare paymentMethodId: number;
  declare userId: number;
  declare categoryId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare user?: User;
  declare category?: Category;
  declare movementType?: MovementType;
  declare paymentMethod?: PaymentMethod;

  static associate(models: Models): void {
    Movement.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Movement.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    Movement.belongsTo(models.MovementType, { foreignKey: 'typeId', as: 'movementType' });
    Movement.belongsTo(models.PaymentMethod, {
      foreignKey: 'paymentMethodId',
      as: 'paymentMethod',
    });
  }
}

Movement.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    typeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'type_id',
      references: { model: 'movement_types', key: 'id' },
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paymentMethodId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'payment_method_id',
      references: { model: 'payment_methods', key: 'id' },
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id',
      references: { model: 'users', key: 'id' },
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'category_id',
      references: { model: 'categories', key: 'id' },
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'movements',
    modelName: 'Movement',
  },
);
