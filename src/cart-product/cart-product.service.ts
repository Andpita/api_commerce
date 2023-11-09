import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from './entities/cart-product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCartDTO } from '../cart/dtos/insert-cart.dto';
import { CartEntity } from '../cart/entities/cart.entity';
import { ProductService } from '../product/product.service';
import { UpdateProductCartDTO } from '../cart/dtos/update-cart.dto';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productService: ProductService,
  ) {}

  async verifyProductInCart(
    productId: number,
    cartId: number,
  ): Promise<CartProductEntity> {
    const productInCart = await this.cartProductRepository.findOne({
      where: {
        productId,
        cartId,
      },
    });

    if (!productInCart) {
      throw new NotFoundException(
        `Produto ${productId} não foi encontrado no carinho ${cartId}`,
      );
    }

    return productInCart;
  }

  async createProductInCart(
    insertCart: InsertCartDTO,
    cartId: number,
  ): Promise<CartProductEntity> {
    return await this.cartProductRepository.save({
      cartId,
      productId: insertCart.productId,
      amount: insertCart.amount,
    });
  }

  async insertProductInCart(
    insertCart: InsertCartDTO,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    const product = await this.productService.findProductById(
      insertCart.productId,
    );

    if (!product) {
      throw new NotFoundException(
        `Produto ${insertCart.productId} não encontrado`,
      );
    }

    const cartProduct = await this.verifyProductInCart(
      insertCart.productId,
      cart.id,
    ).catch(() => undefined);

    if (!cartProduct) {
      return this.createProductInCart(insertCart, cart.id);
    }

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: cartProduct.amount + insertCart.amount,
    });
  }

  async deleteProductCart(
    productId: number,
    cartId: number,
  ): Promise<DeleteResult> {
    return this.cartProductRepository.delete({ productId, cartId });
  }

  async updateProductCart(
    updateProduct: UpdateProductCartDTO,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    const product = await this.productService.findProductById(
      updateProduct.productId,
    );

    if (!product) {
      throw new NotFoundException(
        `Produto ${updateProduct.productId} não encontrado`,
      );
    }

    const cartProduct = await this.verifyProductInCart(
      updateProduct.productId,
      cart.id,
    );

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: updateProduct.amount,
    });
  }
}
