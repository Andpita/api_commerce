import { InsertCartDTO } from '../../cart/dtos/insert-cart.dto';
import { cartProductMock } from './cart-product.mock';

export const insertProductMock: InsertCartDTO = {
  productId: cartProductMock.productId,
  amount: cartProductMock.amount,
};
