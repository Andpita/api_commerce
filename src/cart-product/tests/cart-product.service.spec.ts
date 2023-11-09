import { Test, TestingModule } from '@nestjs/testing';
import { CartProductService } from '../cart-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProductEntity } from '../entities/cart-product.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../../product/product.service';
import { cartProductMock } from '../mocks/cart-product.mock';
import { insertProductMock } from '../mocks/insertPMock.mock';
import { productMock } from '../../product/mocks/product.mock';
import { productDeleteMock } from '../../product/mocks/productDelete.mock';
import { updateProductMock } from '../mocks/updatePMock.mock copy';
import { NotFoundException } from '@nestjs/common';
import { cartMock } from '../../cart/mocks/cart.mock';

describe('CartProductService', () => {
  let service: CartProductService;
  let cartProductRepository: Repository<CartProductEntity>;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartProductService,
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(cartProductMock),
            find: jest.fn().mockResolvedValue([cartProductMock]),
            findOne: jest.fn().mockResolvedValue(cartProductMock),
            delete: jest.fn().mockResolvedValue(productDeleteMock),
            put: jest.fn().mockResolvedValue(updateProductMock),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findProductById: jest.fn().mockResolvedValue(productMock),
          },
        },
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    cartProductRepository = module.get(getRepositoryToken(CartProductEntity));
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartProductRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  //Create new product in cart
  it('should return new product in cart', async () => {
    const productInCart = await service.createProductInCart(
      insertProductMock,
      cartProductMock.cartId,
    );

    expect(productInCart).toEqual(cartProductMock);
  });

  it('should return error in exception new product in cart', async () => {
    jest.spyOn(cartProductRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.createProductInCart(insertProductMock, cartProductMock.cartId),
    ).rejects.toThrowError();
  });

  //Delete product in cart
  it('should return delete product in cart', async () => {
    const deleteProduct = await service.deleteProductCart(
      productMock.id,
      cartProductMock.cartId,
    );

    expect(deleteProduct).toEqual(productDeleteMock);
  });

  it('should return error in exception delete product in cart', async () => {
    jest.spyOn(cartProductRepository, 'delete').mockRejectedValue(new Error());

    expect(
      service.deleteProductCart(productMock.id, cartProductMock.cartId),
    ).rejects.toThrow();
  });

  //Check Product in Cart
  it('should return product in cart', async () => {
    const productCart = await service.verifyProductInCart(
      productMock.id,
      cartProductMock.cartId,
    );

    expect(productCart).toEqual(cartProductMock);
  });

  it('should return error not found product in cart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.verifyProductInCart(productMock.id, cartProductMock.cartId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return error in exception product in cart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

    expect(
      service.verifyProductInCart(productMock.id, cartProductMock.cartId),
    ).rejects.toThrow();
  });

  //Insert product in cart;
  it('should return new product in cart', async () => {
    const productInCart = await service.insertProductInCart(
      insertProductMock,
      cartMock,
    );

    expect(productInCart).toEqual(cartProductMock);
  });

  it('should return error in exception product not exist', async () => {
    jest.spyOn(productService, 'findProductById').mockResolvedValue(undefined);

    expect(
      service.insertProductInCart(insertProductMock, cartMock),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return cartProduct if not exist cart', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    const cartProduct = await service.insertProductInCart(
      insertProductMock,
      cartMock,
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0].amount).toEqual(insertProductMock.amount);
  });

  it('should return cart product if exist cart', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.insertProductInCart(
      insertProductMock,
      cartMock,
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartProductMock,
      amount: cartProductMock.amount + insertProductMock.amount,
    });
  });

  //Update product in cart

  it('should return error in exception productId for updateProductInCart', async () => {
    jest
      .spyOn(productService, 'findProductById')
      .mockRejectedValue(new NotFoundException());

    expect(
      service.updateProductCart(updateProductMock, cartMock),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return cart not exist cart (updateProductInCart)', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.updateProductCart(updateProductMock, cartMock),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return product not exist (updateProductInCart)', async () => {
    jest.spyOn(productService, 'findProductById').mockResolvedValue(undefined);

    expect(
      service.updateProductCart(updateProductMock, cartMock),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return cartProduct with updated amount', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.updateProductCart(
      updateProductMock,
      cartMock,
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0].amount).toEqual(updateProductMock.amount);
  });
});
