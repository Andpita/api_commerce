import { OrderEntity } from '../../order/entities/order.entity';
import { AddressEntity } from '../../address/entities/address.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  // @Column({ name: 'lastName', nullable: false })
  // lastName: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'cpf', nullable: false })
  cpf: string;

  @Column({ name: 'type_user', nullable: false })
  typeUser: number;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'phone' })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AddressEntity, (addresses) => addresses.user)
  addresses?: AddressEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders?: OrderEntity[];
}
