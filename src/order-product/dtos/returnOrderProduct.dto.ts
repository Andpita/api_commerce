import { ReturnProductDTO } from '../../product/dtos/returnProduct.dto';
import { OrderProductEntity } from '../entities/order-product.entity';
import { ReturnOrderDTO } from '../../order/dtos/return-order.dto';

export class ReturnOrderProductDTO {
  id: number;
  orderId: number;
  productId: number;
  amount: number;
  price: number;
  order?: ReturnOrderDTO;
  product?: ReturnProductDTO;

  constructor(orderProducts: OrderProductEntity) {
    this.id = orderProducts.id;
    this.orderId = orderProducts.orderId;
    this.productId = orderProducts.productId;
    this.amount = orderProducts.amount;
    this.price = orderProducts.price;
    this.order = orderProducts.order
      ? new ReturnOrderDTO(orderProducts.order)
      : undefined;
    this.product = orderProducts.product
      ? new ReturnProductDTO(orderProducts.product)
      : undefined;
  }
}
