import { Test, TestingModule } from '@nestjs/testing';
import { OrderProductService } from '../order-product.service';
import { Repository } from 'typeorm';
import { OrderProductEntity } from '../entities/order-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productMock } from '../../product/mocks/product.mock';
import { orderMock } from '../../order/mocks/order.mock';
import { cartProductMock } from '../../cart-product/mocks/cart-product.mock';
import { orderProductMock } from '../mocks/order-product.mock';

describe('OrderProductService', () => {
  let service: OrderProductService;
  let orderProductRepository: Repository<OrderProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductService,
        {
          provide: getRepositoryToken(OrderProductEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(orderProductMock),
          },
        },
      ],
    }).compile();

    service = module.get<OrderProductService>(OrderProductService);
    orderProductRepository = module.get(getRepositoryToken(OrderProductEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderProductRepository).toBeDefined();
  });

  it('should return new orderProduct', async () => {
    const newOrderProduct = await service.createOrderProduct(
      productMock.id,
      orderMock.id,
      cartProductMock.amount,
      productMock.price,
    );

    expect(newOrderProduct).toEqual(orderProductMock);
  });

  it('should return error in exception db a orderProduct', async () => {
    jest.spyOn(orderProductRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.createOrderProduct(
        productMock.id,
        orderMock.id,
        cartProductMock.amount,
        productMock.price,
      ),
    ).rejects.toThrowError();
  });
});
