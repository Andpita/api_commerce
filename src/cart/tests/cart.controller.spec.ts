import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { userMock } from '../../user/mocks/user.mock';
import { insertProductMock } from '../../cart-product/mocks/insertPMock.mock';
import { cartMock } from '../mocks/cart.mock';
import { productDeleteMock } from '../../product/mocks/productDelete.mock';
import { productMock } from '../../product/mocks/product.mock';
import { updateProductMock } from '../../cart-product/mocks/updatePMock.mock copy';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CartService,
          useValue: {
            insertItemCart: jest.fn().mockResolvedValue(cartMock),
            checkCart: jest.fn().mockResolvedValue(cartMock),
            deleteProductCart: jest.fn().mockResolvedValue(productDeleteMock),
            updateProductCart: jest.fn().mockResolvedValue(cartMock),
            clearCart: jest.fn().mockResolvedValue(productDeleteMock),
          },
        },
      ],
      controllers: [CartController],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cartService).toBeDefined();
  });

  it('should return insertItemCart success (Post)', async () => {
    const cartProduct = await controller.insertItemCart(
      userMock.id,
      insertProductMock,
    );

    expect(cartProduct).toEqual({
      id: cartMock.id,
    });
  });

  it('should return checkCart success (Get)', async () => {
    const cart = await controller.checkCart(userMock.id);

    expect(cart).toEqual({
      id: cartMock.id,
    });
  });

  it('should return delete productCart success (delete)', async () => {
    const cart = await controller.deleteProductCart(
      productMock.id,
      userMock.id,
    );

    expect(cart).toEqual(productDeleteMock);
  });

  it('should return update cart success (patch)', async () => {
    const cart = await controller.updateProductCart(
      userMock.id,
      updateProductMock,
    );

    expect(cart).toEqual({
      id: cartMock.id,
    });
  });

  it('should return delete cart success (delete)', async () => {
    const cart = await controller.clearCart(userMock.id);

    expect(cart).toEqual({
      raw: [],
      affected: 1,
    });
  });
});
