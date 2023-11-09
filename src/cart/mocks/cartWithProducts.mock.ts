import { cartProductMock } from '../../cart-product/mocks/cart-product.mock';
import { userMock } from '../../user/mocks/user.mock';
import { CartEntity } from '../entities/cart.entity';

export const cartWithProductsMock: CartEntity = {
  id: 321,
  userId: userMock.id,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  cartProduct: [cartProductMock],
};
