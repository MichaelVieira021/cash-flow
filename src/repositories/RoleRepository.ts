import { Role } from '../models/Role';

export class RoleRepository {
  async findAll(): Promise<Role[]> {
    return Role.findAll({ order: [['id', 'ASC']] });
  }

  async findById(id: number): Promise<Role | null> {
    return Role.findByPk(id);
  }

  async findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name } });
  }
}

export const roleRepository = new RoleRepository();
