import { MovementTypeDto } from '../dtos/movementType';
import { NotFoundError } from '../exceptions';
import { movementTypeRepository } from '../repositories/MovementTypeRepository';

export class MovementTypeService {
  async getAll(): Promise<MovementTypeDto.Response[]> {
    const types = await movementTypeRepository.findAll();
    return types.map(MovementTypeDto.toResponse);
  }

  async validateById(id: number): Promise<void> {
    const exists = await movementTypeRepository.existsById(id);
    if (!exists) {
      throw new NotFoundError(`Tipo de movimento não encontrado para o id ${id}`);
    }
  }
}

export const movementTypeService = new MovementTypeService();
