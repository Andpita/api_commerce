import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCartDTO } from './dtos/insert-cart.dto';
import { CartProductService } from '../cart-product/cart-product.service';
import { UpdateProductCartDTO } from './dtos/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductService: CartProductService,
  ) {}

  async clearCart(userId: number): Promise<DeleteResult> {
    const lineAffected = 1;

    const cart = await this.checkCart(userId);

    await this.cartRepository.save({
      ...cart,
      active: false,
    });

    return {
      raw: ['Cart Empty'],
      affected: lineAffected,
    };
  }

  async checkCart(userId: number, isRelations?: boolean): Promise<CartEntity> {
    const relations = isRelations
      ? { cartProduct: { product: true } }
      : undefined;

    const cartActive = await this.cartRepository.findOne({
      where: { userId, active: true },
      relations,
    });

    if (!cartActive) {
      throw new NotFoundException(`Nenhum carrinho ativo`);
    }

    return cartActive;
  }

  async createCart(userId: number): Promise<CartEntity> {
    const newCart = await this.cartRepository.save({
      active: true,
      userId: userId,
    });

    if (!newCart) {
      throw new NotFoundException(`Erro ao criar carrinho.`);
    }

    return newCart;
  }

  async insertItemCart(
    userId: number,
    insertItem: InsertCartDTO,
  ): Promise<CartEntity> {
    const cart = await this.checkCart(userId).catch(async () => {
      return await this.createCart(userId);
    });

    await this.cartProductService.insertProductInCart(insertItem, cart);

    return cart;
  }

  async deleteProductCart(
    productId: number,
    userId: number,
  ): Promise<DeleteResult> {
    const cart = await this.checkCart(userId);

    return this.cartProductService.deleteProductCart(productId, cart.id);
  }

  async updateProductCart(
    updateProduct: UpdateProductCartDTO,
    userId: number,
  ): Promise<CartEntity> {
    const cart = await this.checkCart(userId).catch(async () => {
      return await this.createCart(userId);
    });

    await this.cartProductService.updateProductCart(updateProduct, cart);

    return cart;
  }
}
