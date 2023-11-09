import { ReturnProductDTO } from '../../product/dtos/returnProduct.dto';
import { CartProductEntity } from '../entities/cart-product.entity';
import { ReturnCartDTO } from '../../cart/dtos/return-cart.dto';

export class ReturnCartProductsDTO {
  id: number;
  amount: number;
  product?: ReturnProductDTO;
  cart?: ReturnCartDTO;

  constructor(cartProducts: CartProductEntity) {
    this.id = cartProducts.id;
    this.amount = cartProducts.amount;
    this.product = cartProducts.product
      ? new ReturnProductDTO(cartProducts.product)
      : undefined;
    this.cart = cartProducts.cart
      ? new ReturnCartDTO(cartProducts.cart)
      : undefined;
  }
}
