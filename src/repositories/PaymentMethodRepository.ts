import { PaymentMethod } from '../models/PaymentMethod';

export class PaymentMethodRepository {
  async findAll(): Promise<PaymentMethod[]> {
    return await PaymentMethod.findAll({ order: [['id', 'ASC']] });
  }

  async findById(id: number): Promise<PaymentMethod | null> {
    return await PaymentMethod.findByPk(id);
  }
  async existsById(id: number): Promise<boolean> {
    return (await PaymentMethod.count({ where: { id } })) > 0;
  }
}

export const paymentMethodRepository = new PaymentMethodRepository();
