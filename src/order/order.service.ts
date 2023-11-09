import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { PaymentService } from '../payment/payment.service';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { CartService } from '../cart/cart.service';
import { OrderProductService } from '../order-product/order-product.service';
import { ProductService } from '../product/product.service';
import { CartEntity } from '../cart/entities/cart.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { OrderProductEntity } from '../order-product/entities/order-product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
    private readonly productService: ProductService,
  ) {}

  async saveOrder(
    newOrder: CreateOrderDTO,
    payment: PaymentEntity,
    userId: number,
  ): Promise<OrderEntity> {
    return this.orderRepository.save({
      addressId: newOrder.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    });
  }

  async createOrderProductsInCart(
    cart: CartEntity,
    orderId: number,
    products: ProductEntity[],
  ): Promise<OrderProductEntity[]> {
    return Promise.all(
      cart.cartProduct?.map((cartProduct) =>
        this.orderProductService.createOrderProduct(
          cartProduct.productId,
          orderId,
          cartProduct.amount,
          products.find((product) => product.id === cartProduct.productId)
            ?.price || 0,
        ),
      ),
    );
  }

  async createOrder(
    newOrder: CreateOrderDTO,
    userId: number,
  ): Promise<OrderEntity> {
    const cart = await this.cartService.checkCart(userId, true);
    const products = await this.productService.findAllProducts(
      cart.cartProduct?.map((product) => product.productId),
    );

    const payment = await this.paymentService.createPayment(
      newOrder,
      products,
      cart,
    );
    const order = await this.saveOrder(newOrder, payment, userId);

    await this.createOrderProductsInCart(cart, order.id, products);

    await this.cartService.clearCart(userId);

    return order;
  }

  async findMyOrders(
    userId?: number,
    orderId?: number,
  ): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      where: {
        userId,
        id: orderId,
      },
      relations: {
        address: {
          city: {
            state: true,
          },
        },
        orderProduct: {
          product: true,
        },
        payment: {
          status: true,
        },
        user: !!orderId,
      },
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException(
        `Nenhuma ordem (${orderId}) de compra encontrada e/ou usuário (${userId}) não encontrado`,
      );
    }

    return orders;
  }

  async allOrders(): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      relations: {
        user: true,
        address: true,
      },
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException(`Nenhuma ordem de compra encontrada`);
    }

    const ordersProducts =
      await this.orderProductService.findAmountProductsByOrderId(
        orders.map((order) => order.id),
      );

    return orders.map((order) => {
      const orderProduct = ordersProducts.find(
        (currentOrder) => currentOrder.order_id === order.id,
      );

      if (orderProduct) {
        return {
          ...order,
          amountProducts: Number(orderProduct.total),
        };
      }

      return order;
    });
  }
}
