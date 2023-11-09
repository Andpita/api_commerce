import { PaymentCreditCardEntity } from '../entities/payment-credit-card.entity';
import { paymentMock } from './payment.mock';

export const paymentCCMock: PaymentCreditCardEntity = {
  ...paymentMock,
  amountPayments: 12,
  type: 'CC',
};
