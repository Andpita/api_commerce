import { ChildEntity, Column } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { CreateOrderDTO } from '../../order/dtos/create-order.dto';

@ChildEntity()
export class PaymentCreditCardEntity extends PaymentEntity {
  @Column({ name: 'amount_payments' })
  amountPayments: number;

  constructor(
    statusId: number,
    price: number,
    discount: number,
    finalPrice: number,
    newOrder: CreateOrderDTO,
  ) {
    super(statusId, price, discount, finalPrice);
    this.amountPayments = newOrder?.amountPayments || 0;
  }
}
