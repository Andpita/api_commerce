import { OrderEntity } from '../../order/entities/order.entity';
import { PaymentStatusEntity } from '../../payment-status/entities/payment-status.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'payment' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class PaymentEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'status_id', nullable: false })
  statusId: number;

  @Column({ name: 'price', type: 'decimal', nullable: false })
  price: number;

  @Column({ name: 'discount', type: 'decimal', nullable: false })
  discount: number;

  @Column({ name: 'final_price', type: 'decimal', nullable: false })
  finalPrice: number;

  @Column({ name: 'type', nullable: false })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderEntity, (order) => order.payment)
  orders?: OrderEntity[];

  @ManyToOne(() => PaymentStatusEntity, (status) => status.payment)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status?: PaymentStatusEntity;

  constructor(
    statusId: number,
    price: number,
    discount: number,
    finalPrice: number,
  ) {
    this.statusId = statusId;
    this.price = price;
    this.discount = discount;
    this.finalPrice = finalPrice;
  }
}
