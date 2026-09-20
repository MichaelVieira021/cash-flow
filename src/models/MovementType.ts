import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../config/database';
import { AuditAttributes } from './audit';
import type { Models } from './index';

export interface MovementTypeAttributes extends AuditAttributes {
  id: number;
  name: string;
}

export type MovementTypeCreationAttributes = Optional<
  MovementTypeAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class MovementType
  extends Model<MovementTypeAttributes, MovementTypeCreationAttributes>
  implements MovementTypeAttributes
{
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate(models: Models): void {
    MovementType.hasMany(models.Movement, { foreignKey: 'typeId', as: 'movements' });
  }
}

MovementType.init(
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
    tableName: 'movement_types',
    modelName: 'MovementType',
  },
);
