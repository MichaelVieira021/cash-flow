import { Category } from './Category';
import { Movement } from './Movement';
import { MovementType } from './MovementType';
import { PaymentMethod } from './PaymentMethod';
import { Role } from './Role';
import { User } from './User';

export const models = {
  User,
  Category,
  Movement,
  MovementType,
  PaymentMethod,
  Role,
};

export type Models = typeof models;

Object.values(models).forEach((model) => {
  model.associate?.(models);
});

export { Category, Movement, MovementType, PaymentMethod, Role, User };
export type { CategoryCreationAttributes } from './Category';
export type { MovementCreationAttributes } from './Movement';
