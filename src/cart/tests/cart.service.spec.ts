import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProductService } from '../../cart-product/cart-product.service';
import { cartMock } from '../mocks/cart.mock';
import { cartDeleteMock } from '../mocks/cartDelete.mock';
import { userMock } from '../../user/mocks/user.mock';
import { NotFoundException } from '@nestjs/common';
import { cartProductMock } from '../../cart-product/mocks/cart-product.mock';
import { productDeleteMock } from '../../product/mocks/productDelete.mock';
import { updateProductMock } from '../../cart-product/mocks/updatePMock.mock copy';
import { insertProductMock } from '../../cart-product/mocks/insertPMock.mock';
import { productMock } from '../../product/mocks/product.mock';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;
  let cartProductService: CartProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(cartMock),
            find: jest.fn().mockResolvedValue([cartMock]),
            findOne: jest.fn().mockResolvedValue(cartMock),
            delete: jest.fn().mockResolvedValue(cartDeleteMock),
            patch: jest.fn().mockResolvedValue(0),
          },
        },
        {
          provide: CartProductService,
          useValue: {
            updateProductCart: jest.fn().mockResolvedValue(updateProductMock),
            insertProductInCart: jest.fn().mockResolvedValue(cartProductMock),
            deleteProductCart: jest.fn().mockResolvedValue(productDeleteMock),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get(getRepositoryToken(CartEntity));
    cartProductService = module.get<CartProductService>(CartProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartRepository).toBeDefined();
    expect(cartProductService).toBeDefined();
  });

  //ClearCart
  it('should return delete cart (active cart false)', async () => {
    const spy = jest.spyOn(cartRepository, 'save');
    const cart = await service.clearCart(userMock.id);

    expect(cart).toEqual(cartDeleteMock);
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartMock,
      active: false,
    });
  });

  it('should return error in cart not found', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.clearCart(userMock.id)).rejects.toThrow(NotFoundException);
  });

  it('should return error in exception clearCart', async () => {
    jest.spyOn(cartRepository, 'save').mockRejectedValue(new Error());

    expect(service.clearCart(userMock.id)).rejects.toThrow(Error());
  });

  //CheckCart
  it('should return cart for checkcart (not relations)', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.checkCart(userMock.id);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0].relations).toEqual(undefined);
  });

  it('should return cart for checkcart (send relations)', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.checkCart(userMock.id, true);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0].relations).toEqual({
      cartProduct: { product: true },
    });
  });

  it('should return error cart for checkcart', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.checkCart(userMock.id)).rejects.toThrow(NotFoundException);
  });

  it('should return error in exception checkCart', async () => {
    jest.spyOn(cartRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.clearCart(userMock.id)).rejects.toThrow(Error());
  });

  //CreateCart
  it('should return create cart', async () => {
    const spy = jest.spyOn(cartRepository, 'save');
    const cart = await service.createCart(userMock.id);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0]).toEqual({ userId: userMock.id, active: true });
  });

  it('should return error create cart', async () => {
    jest.spyOn(cartRepository, 'save').mockResolvedValue(undefined);

    expect(service.createCart(userMock.id)).rejects.toThrow(NotFoundException);
  });

  it('should return error in exception createCart', async () => {
    jest.spyOn(cartRepository, 'save').mockRejectedValue(new Error());

    expect(service.createCart(userMock.id)).rejects.toThrow(Error());
  });

  //Insert Product in Cart
  it('should return cart in cart not found (insertProductInCart)', async () => {
    jest.spyOn(cartRepository, 'findOne').mockRejectedValue(undefined);
    const spyCreateCart = jest.spyOn(cartRepository, 'save');
    const spyInsertProduct = jest.spyOn(
      cartProductService,
      'insertProductInCart',
    );

    const cart = await service.insertItemCart(userMock.id, insertProductMock);

    expect(cart).toEqual(cartMock);
    expect(spyCreateCart.mock.calls.length).toEqual(1);
    expect(spyInsertProduct.mock.calls.length).toEqual(1);
  });

  it('should return cart in cart found (insertProductInCart)', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cartMock);
    const spyCreateCart = jest.spyOn(cartRepository, 'save');
    const spyInsertProduct = jest.spyOn(
      cartProductService,
      'insertProductInCart',
    );

    const cart = await service.insertItemCart(userMock.id, insertProductMock);

    expect(cart).toEqual(cartMock);
    expect(spyCreateCart.mock.calls.length).toEqual(0);
    expect(spyInsertProduct.mock.calls.length).toEqual(1);
  });

  //Delete Product in Cart
  it('should return delete product in cart', async () => {
    const deleted = jest.spyOn(cartProductService, 'deleteProductCart');
    const deleteProduct = await service.deleteProductCart(
      productMock.id,
      userMock.id,
    );

    expect(deleteProduct).toEqual(productDeleteMock);
    expect(deleted.mock.calls.length).toEqual(1);
  });

  it('should return error in find Cart', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);
    const deleted = jest.spyOn(cartProductService, 'deleteProductCart');

    expect(
      service.deleteProductCart(productMock.id, userMock.id),
    ).rejects.toThrow();
    expect(deleted.mock.calls.length).toEqual(0);
  });

  //Update Product in Cart
  it('should return update product in cart (cart exist)', async () => {
    const spyUpdate = jest.spyOn(cartProductService, 'updateProductCart');
    const createCart = jest
      .spyOn(cartRepository, 'save')
      .mockResolvedValue(cartMock);

    const upProduct = await service.updateProductCart(
      updateProductMock,
      userMock.id,
    );

    expect(upProduct).toEqual(cartMock);
    expect(spyUpdate.mock.calls.length).toEqual(1);
    expect(createCart.mock.calls.length).toEqual(0);
  });

  it('should return update product in cart (cart not exist)', async () => {
    const spyUpdate = jest.spyOn(cartProductService, 'updateProductCart');
    const createCart = jest
      .spyOn(cartRepository, 'findOne')
      .mockResolvedValue(undefined);

    const upProduct = await service.updateProductCart(
      updateProductMock,
      userMock.id,
    );

    expect(upProduct).toEqual(cartMock);
    expect(spyUpdate.mock.calls.length).toEqual(1);
    expect(createCart.mock.calls.length).toEqual(1);
  });

  it('should return error in excpetion in Cart for Cart Update', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);
    jest.spyOn(cartRepository, 'save').mockResolvedValue(undefined);

    expect(
      service.updateProductCart(updateProductMock, userMock.id),
    ).rejects.toThrow();
  });
});
