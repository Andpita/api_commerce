import { CartEntity } from '../entities/cart.entity';
import { ReturnCartProductsDTO } from '../../cart-product/dtos/returnCartProducts.dto';

export class ReturnCartDTO {
  id: number;
  cartProducts?: ReturnCartProductsDTO[];

  constructor(cart: CartEntity) {
    this.id = cart.id;
    this.cartProducts = cart.cartProduct
      ? cart.cartProduct.map((product) => new ReturnCartProductsDTO(product))
      : undefined;
  }
}
