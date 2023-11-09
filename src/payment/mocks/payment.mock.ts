import { PaymentEntity } from '../entities/payment.entity';
import { PaymentType } from '../enum/payment-type.enum';

export const paymentMock: PaymentEntity = {
  createdAt: new Date(),
  updatedAt: new Date(),
  id: 123,
  price: 100,
  discount: 0,
  finalPrice: 100,
  statusId: PaymentType.Done,
  type: '0',
};
