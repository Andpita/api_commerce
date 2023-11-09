import { ChildEntity, Column } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { CreateOrderDTO } from '../../order/dtos/create-order.dto';

@ChildEntity()
export class PaymentPixEntity extends PaymentEntity {
  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'date_payment' })
  datePayment: Date;

  constructor(
    statusId: number,
    price: number,
    discount: number,
    finalPrice: number,
    newOrder: CreateOrderDTO,
  ) {
    super(statusId, price, discount, finalPrice);
    this.code = newOrder?.codePix || '';
    this.datePayment = new Date(newOrder?.datePayment) || new Date();
  }
}
