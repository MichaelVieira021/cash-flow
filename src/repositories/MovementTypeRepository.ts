import { MovementType } from '../models/MovementType';

export class MovementTypeRepository {
  async findAll(): Promise<MovementType[]> {
    return await MovementType.findAll({ order: [['id', 'ASC']] });
  }

  async findById(id: number): Promise<MovementType | null> {
    return await MovementType.findByPk(id);
  }

  async existsById(id: number): Promise<boolean> {
    return (await MovementType.count({ where: { id } })) > 0;
  }

  async findByName(name: string): Promise<MovementType | null> {
    return await MovementType.findOne({ where: { name } });
  }
}

export const movementTypeRepository = new MovementTypeRepository();
