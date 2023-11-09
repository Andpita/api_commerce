import { ReturnUserDTO } from '../../user/dtos/returnUser.dto';
import { OrderEntity } from '../entities/order.entity';
import { ReturnAddressDTO } from '../../address/dtos/returnAddress.dto';
import { ReturnPaymentDTO } from '../../payment/dtos/returnPayment.dto';
import { ReturnOrderProductDTO } from '../../order-product/dtos/returnOrderProduct.dto';

export class ReturnOrderDTO {
  date: string;
  userId: number;
  addressId: number;
  paymentId: number;
  orderId: number;
  amountProducts?: number;
  user?: ReturnUserDTO;
  address?: ReturnAddressDTO;
  payment?: ReturnPaymentDTO;
  orderProduct?: ReturnOrderProductDTO[];

  constructor(order?: OrderEntity) {
    this.date = order?.date.toString();
    this.userId = order?.userId;
    this.addressId = order?.addressId;
    this.paymentId = order?.paymentId;
    this.orderId = order?.id;
    this.amountProducts = order?.amountProducts;
    this.user = order.user ? new ReturnUserDTO(order.user) : undefined;
    this.address = order.address
      ? new ReturnAddressDTO(order.address)
      : undefined;
    this.payment = order.payment
      ? new ReturnPaymentDTO(order.payment)
      : undefined;
    this.orderProduct = order.orderProduct
      ? order.orderProduct.map((order) => new ReturnOrderProductDTO(order))
      : undefined;
  }
}
