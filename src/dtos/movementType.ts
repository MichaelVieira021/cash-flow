import { MovementType } from '../models/MovementType';

export namespace MovementTypeDto {
  export interface Response {
    id: number;
    name: string;
  }

  export function toResponse(type: MovementType): Response {
    return {
      id: Number(type.id),
      name: type.name,
    };
  }
}
