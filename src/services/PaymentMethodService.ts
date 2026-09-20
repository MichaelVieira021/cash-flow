import { PaymentMethodDto } from '../dtos/paymentMethod';
import { NotFoundError } from '../exceptions';
import { paymentMethodRepository } from '../repositories/PaymentMethodRepository';

export class PaymentMethodService {
  async getAll(): Promise<PaymentMethodDto.Response[]> {
    const methods = await paymentMethodRepository.findAll();
    return methods.map(PaymentMethodDto.toResponse);
  }

  async validateById(id: number): Promise<void> {
    const exists = await paymentMethodRepository.existsById(id);
    if (!exists) {
      throw new NotFoundError(`Método de pagamento não encontrado para o id ${id}`);
    }
  }
}

export const paymentMethodService = new PaymentMethodService();
