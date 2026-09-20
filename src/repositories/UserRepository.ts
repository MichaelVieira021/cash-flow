import { Includeable, Op } from 'sequelize';

import { Role } from '../models/Role';
import { User, UserCreationAttributes } from '../models/User';

const roleInclude: Includeable = { model: Role, as: 'role' };

export class UserRepository {
  async create(data: UserCreationAttributes): Promise<User> {
    const user = await User.create(data);
    return (await this.findById(user.id)) ?? user;
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id, { include: [roleInclude] });
  }

  async findAll(): Promise<User[]> {
    return User.findAll({ include: [roleInclude] });
  }

  async findByLogin(login: string): Promise<User | null> {
    return User.findOne({
      where: { login },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name'],
        },
      ],
    });
  }

  async existsByLoginILike(login: string): Promise<boolean> {
    const count = await User.count({
      where: { login: { [Op.iLike]: login } },
    });
    return count > 0;
  }
}

export const userRepository = new UserRepository();
