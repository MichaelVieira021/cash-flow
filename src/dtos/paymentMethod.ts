import { PaymentMethod } from '../models/PaymentMethod';

export namespace PaymentMethodDto {
  export interface Response {
    id: number;
    name: string;
  }

  export function toResponse(method: PaymentMethod): Response {
    return {
      id: Number(method.id),
      name: method.name,
    };
  }
}
