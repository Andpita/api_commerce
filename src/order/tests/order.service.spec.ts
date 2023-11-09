import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentService } from '../../payment/payment.service';
import { ProductService } from '../../product/product.service';
import { OrderProductService } from '../../order-product/order-product.service';
import { CartService } from '../../cart/cart.service';
import { orderMock } from '../mocks/order.mock';
import {
  createOrderMockCC,
  createOrderMockPix,
} from '../mocks/createOrder.mock';
import { userMock } from '../../user/mocks/user.mock';
import { paymentCCMock } from '../../payment/mocks/paymentCC.mock';
import { NotFoundException } from '@nestjs/common';
import { orderProductMock } from '../../order-product/mocks/order-product.mock';
import { productMock } from '../../product/mocks/product.mock';
import { cartWithProductsMock } from '../../cart/mocks/cartWithProducts.mock';
import { cartDeleteMock } from '../../cart/mocks/cartDelete.mock';

jest.useFakeTimers().setSystemTime(new Date('2023-10-10'));

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<OrderEntity>;
  let paymentService: PaymentService;
  let productService: ProductService;
  let orderProductService: OrderProductService;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(orderMock),
            find: jest.fn().mockResolvedValue([orderMock]),
          },
        },
        {
          provide: CartService,
          useValue: {
            checkCart: jest.fn().mockResolvedValue(cartWithProductsMock),
            clearCart: jest.fn().mockResolvedValue(cartDeleteMock),
          },
        },
        {
          provide: OrderProductService,
          useValue: {
            createOrderProduct: jest.fn().mockResolvedValue(orderProductMock),
            findAmountProductsByOrderId: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findAllProducts: jest.fn().mockResolvedValue([productMock]),
          },
        },
        {
          provide: PaymentService,
          useValue: {
            createPayment: jest.fn().mockResolvedValue(paymentCCMock),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(getRepositoryToken(OrderEntity));
    cartService = module.get<CartService>(CartService);
    orderProductService = module.get<OrderProductService>(OrderProductService);
    productService = module.get<ProductService>(ProductService);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderRepository).toBeDefined();
    expect(cartService).toBeDefined();
    expect(orderProductService).toBeDefined();
    expect(productService).toBeDefined();
    expect(paymentService).toBeDefined();
  });

  //SaveOrder
  it('should save order success', async () => {
    const spy = jest.spyOn(orderRepository, 'save');

    const newOrder = await service.saveOrder(
      createOrderMockCC,
      paymentCCMock,
      userMock.id,
    );

    expect(newOrder).toEqual(orderMock);
    expect(spy.mock.calls[0][0]).toEqual({
      addressId: createOrderMockCC.addressId,
      paymentId: paymentCCMock.id,
      userId: userMock.id,
      date: new Date(),
    });
  });

  it('should return exception in save order', async () => {
    jest.spyOn(orderRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.saveOrder(createOrderMockCC, paymentCCMock, userMock.id),
    ).rejects.toThrow(Error());
  });

  //Find Orders
  it('should return all orders to user', async () => {
    const spy = jest.spyOn(orderRepository, 'find');
    const newOrder = await service.findMyOrders(userMock.id);

    expect(newOrder).toEqual([orderMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: undefined,
        userId: userMock.id,
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
        user: false,
        payment: {
          status: true,
        },
      },
    });
  });

  it('should return NotFoundException if user not found orders to user', async () => {
    jest.spyOn(orderRepository, 'find').mockResolvedValue(undefined);

    expect(service.findMyOrders(userMock.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  //createOrderProductsInCart
  it('should return createOrderProduct success', async () => {
    const spyOrderProduct = jest.spyOn(
      orderProductService,
      'createOrderProduct',
    );

    const order = await service.createOrderProductsInCart(
      cartWithProductsMock,
      orderMock.id,
      [productMock],
    );

    expect(order).toEqual([orderProductMock]);
    expect(spyOrderProduct.mock.calls.length).toEqual(1);
  });

  //createOrder
  it('should return a new order success', async () => {
    const spyCartCheck = jest.spyOn(cartService, 'checkCart');
    const spyCartClear = jest.spyOn(cartService, 'clearCart');
    const spyFindProducts = jest.spyOn(productService, 'findAllProducts');
    const spyPayment = jest.spyOn(paymentService, 'createPayment');
    const spySaveOrder = jest.spyOn(orderRepository, 'save');

    const order = await service.createOrder(createOrderMockPix, orderMock.id);

    expect(order).toEqual(orderMock);
    expect(spyCartCheck.mock.calls.length).toEqual(1);
    expect(spyCartClear.mock.calls.length).toEqual(1);
    expect(spyFindProducts.mock.calls.length).toEqual(1);
    expect(spyPayment.mock.calls.length).toEqual(1);
    expect(spySaveOrder.mock.calls.length).toEqual(1);
  });

  //Find all Orders for ADM
  it('should return all orders for adm', async () => {
    const spy = jest.spyOn(orderRepository, 'find');
    const newOrder = await service.allOrders();

    expect(newOrder).toEqual([orderMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      relations: {
        user: true,
        address: true,
      },
    });
  });

  it('should return error in fild orders for adm', async () => {
    jest.spyOn(orderRepository, 'find').mockResolvedValue([]);

    expect(service.allOrders()).rejects.toThrowError();
  });

  //Find Orders ADM
  it('should return order by orderId to adm', async () => {
    const spy = jest.spyOn(orderRepository, 'find');
    const newOrder = await service.findMyOrders(undefined, orderMock.id);

    expect(newOrder).toEqual([orderMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: orderMock.id,
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
        user: true,
        payment: {
          status: true,
        },
      },
    });
  });
});
