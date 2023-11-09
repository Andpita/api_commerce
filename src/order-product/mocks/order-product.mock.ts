import { productMock } from '../../product/mocks/product.mock';
import { OrderProductEntity } from '../entities/order-product.entity';
import { orderMock } from '../../order/mocks/order.mock';

export const orderProductMock: OrderProductEntity = {
  createdAt: new Date(),
  updatedAt: new Date(),
  amount: 5,
  productId: productMock.id,
  orderId: orderMock.id,
  id: 8821,
  price: productMock.price,
};
