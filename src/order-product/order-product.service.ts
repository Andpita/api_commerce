import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProductEntity } from './entities/order-product.entity';
import { Repository } from 'typeorm';
import { ReturnGroupOrder } from './dtos/returnOrderGroup.dto';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>,
  ) {}

  async createOrderProduct(
    productId: number,
    orderId: number,
    amount: number,
    price: number,
  ): Promise<OrderProductEntity> {
    return this.orderProductRepository.save({
      productId,
      orderId,
      amount,
      price,
    });
  }

  async findAmountProductsByOrderId(
    orderId: number[],
  ): Promise<ReturnGroupOrder[]> {
    return this.orderProductRepository
      .createQueryBuilder('order_product')
      .select('order_product.order_id, COUNT(*) as total')
      .where('order_product.order_id IN (:...ids)', { ids: orderId })
      .groupBy('order_product.order_id')
      .getRawMany();
  }
}
