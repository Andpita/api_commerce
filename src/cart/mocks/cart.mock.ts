import { userMock } from '../../user/mocks/user.mock';
import { CartEntity } from '../entities/cart.entity';

export const cartMock: CartEntity = {
  id: 321,
  userId: userMock.id,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
