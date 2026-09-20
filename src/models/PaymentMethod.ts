import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../config/database';
import { AuditAttributes } from './audit';
import type { Models } from './index';

export interface PaymentMethodAttributes extends AuditAttributes {
  id: number;
  name: string;
}

export type PaymentMethodCreationAttributes = Optional<
  PaymentMethodAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class PaymentMethod
  extends Model<PaymentMethodAttributes, PaymentMethodCreationAttributes>
  implements PaymentMethodAttributes
{
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate(models: Models): void {
    PaymentMethod.hasMany(models.Movement, { foreignKey: 'paymentMethodId', as: 'movements' });
  }
}

PaymentMethod.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'payment_methods',
    modelName: 'PaymentMethod',
  },
);
