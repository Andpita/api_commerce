import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paymentMock } from '../mocks/payment.mock';

import {
  createOrderFakeMock,
  createOrderMockCC,
  createOrderMockPix,
} from '../../order/mocks/createOrder.mock';
import { productMock } from '../../product/mocks/product.mock';
import { cartMock } from '../../cart/mocks/cart.mock';
import { PaymentPixEntity } from '../entities/payment-pix.entity';
import { paymentPixMock } from '../mocks/paymentPix.mock';
import { PaymentCreditCardEntity } from '../entities/payment-credit-card.entity';
import { paymentCCMock } from '../mocks/paymentCC.mock';
import { BadRequestException } from '@nestjs/common';
import { cartWithProductsMock } from '../../cart/mocks/cartWithProducts.mock';
import { PaymentType } from '../enum/payment-type.enum';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<PaymentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(paymentMock),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get(getRepositoryToken(PaymentEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentRepository).toBeDefined();
  });

  it('should return payment success pix', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');
    const payment = await service.createPayment(
      createOrderMockPix,
      [productMock],
      cartMock,
    );

    const typePayment = spy.mock.calls[0][0] as PaymentPixEntity;

    expect(payment).toEqual(paymentMock);
    expect(typePayment.code).toEqual(paymentPixMock.code);
  });

  it('should return payment success credit card', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');

    const payment = await service.createPayment(
      createOrderMockCC,
      [productMock],
      cartMock,
    );

    const typePayment = spy.mock.calls[0][0] as PaymentCreditCardEntity;

    expect(payment).toEqual(paymentMock);
    expect(typePayment.amountPayments).toEqual(paymentCCMock.amountPayments);
  });

  it('should return payment error (not found method payment)', async () => {
    expect(
      service.createPayment(createOrderFakeMock, [productMock], cartMock),
    ).rejects.toThrow(new BadRequestException('Erro ao efetuar o pagamento'));
  });

  it('should return finalPrice $0 if cartProducts not found or undefined', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');

    await service.createPayment(createOrderMockCC, [productMock], cartMock);

    const typePayment = spy.mock.calls[0][0] as PaymentCreditCardEntity;

    expect(typePayment.finalPrice).toEqual(0);
  });

  it('should return final price after calculation value products in cart ', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');

    await service.createPayment(
      createOrderMockCC,
      [productMock],
      cartWithProductsMock,
    );

    const cartWithProductsAmount = cartWithProductsMock.cartProduct.reduce(
      (ac, prod) => ac + prod.amount,
      0,
    );

    const typePayment = spy.mock.calls[0][0] as PaymentCreditCardEntity;

    expect(typePayment.finalPrice).toEqual(
      productMock.price * cartWithProductsAmount,
    );
  });

  it('should return all data info', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');

    await service.createPayment(
      createOrderMockCC,
      [productMock],
      cartWithProductsMock,
    );

    const cartWithProductsAmount = cartWithProductsMock.cartProduct.reduce(
      (ac, prod) => ac + prod.amount,
      0,
    );

    const typePayment = spy.mock.calls[0][0] as PaymentCreditCardEntity;

    const creditReturn: PaymentCreditCardEntity = new PaymentCreditCardEntity(
      PaymentType.Done,
      productMock.price * cartWithProductsAmount,
      0,
      productMock.price * cartWithProductsAmount,
      createOrderMockCC,
    );

    expect(typePayment).toEqual(creditReturn);
  });
});
