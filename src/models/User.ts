import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../config/database';
import { AuditAttributes } from './audit';
import type { Models } from './index';
import type { Role } from './Role';

export interface UserAttributes extends AuditAttributes {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  passwordHash: string | null;
  roleId: number;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare login: string;
  declare firstName: string;
  declare lastName: string;
  declare passwordHash: string;
  declare roleId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare role?: Role;

  static associate(models: Models): void {
    User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    User.hasMany(models.Category, { foreignKey: 'userId', as: 'categories' });
    User.hasMany(models.Movement, { foreignKey: 'userId', as: 'movements' });
  }

  toJSON(): Omit<UserAttributes, 'passwordHash' | 'roleId'> {
    const values = { ...this.get() } as UserAttributes & { role?: Role };
    delete (values as Partial<UserAttributes>).passwordHash;
    delete (values as Partial<UserAttributes>).roleId;
    delete values.role;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name',
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'password_hash',
    },
    roleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'role_id',
      references: { model: 'roles', key: 'id' },
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  },
);
