import { PaymentStatusEntity } from '../entities/payment-status.entity';

export class ReturnPaymentStatusDTO {
  id: number;
  status: string;

  constructor(statusPaymente: PaymentStatusEntity) {
    this.id = statusPaymente.id;
    this.status = statusPaymente.name;
  }
}
