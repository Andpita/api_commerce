import { addressMock } from '../../address/mocks/address.mock';
import { OrderEntity } from '../entities/order.entity';
import { paymentMock } from '../../payment/mocks/payment.mock';
import { userMock } from '../../user/mocks/user.mock';

export const orderMock: OrderEntity = {
  addressId: addressMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  date: new Date(),
  id: 32153,
  paymentId: paymentMock.id,
  userId: userMock.id,
};
