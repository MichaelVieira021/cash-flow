import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../config/database';
import { AuditAttributes } from './audit';
import type { Models } from './index';
import type { User } from './User';

export interface CategoryAttributes extends AuditAttributes {
  id: number;
  name: string;
  userId: number;
  color: string | null;
  icon: string | null;
}

export type CategoryCreationAttributes = Optional<
  CategoryAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  declare id: number;
  declare name: string;
  declare userId: number;
  declare color: string;
  declare icon: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare user?: User;

  static associate(models: Models): void {
    Category.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Category.hasMany(models.Movement, { foreignKey: 'categoryId', as: 'movements' });
  }
}

Category.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id',
      references: { model: 'users', key: 'id' },
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'categories',
    modelName: 'Category',
  },
);
