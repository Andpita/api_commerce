import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from '../order/dtos/create-order.dto';
import { PaymentCreditCardEntity } from './entities/payment-credit-card.entity';
import { PaymentType } from './enum/payment-type.enum';
import { PaymentPixEntity } from './entities/payment-pix.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { CartEntity } from '../cart/entities/cart.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly PaymentRepository: Repository<PaymentEntity>,
  ) {}

  generateValueProducts(cart: CartEntity, products: ProductEntity[]) {
    if (!cart.cartProduct || cart.cartProduct.length === 0) {
      return 0;
    }

    const price = cart.cartProduct
      .map((productInCart) => {
        const buyList = products.find(
          (product) => product.id === productInCart.productId,
        );

        if (buyList) {
          let valueItem = 0;
          if (productInCart.amount <= 0) {
            valueItem = 0;
          } else {
            valueItem = productInCart.amount;
          }
          return valueItem * buyList.price;
        }
      })
      .reduce((ac, cv) => ac + cv, 0)
      .toFixed(2);

    return Number(price);
  }

  async createPayment(
    newOrder: CreateOrderDTO,
    products: ProductEntity[],
    cart: CartEntity,
  ): Promise<PaymentEntity> {
    const price = this.generateValueProducts(cart, products);
    //const priceMoreFrete = price + //FRETE//;

    if (newOrder.amountPayments) {
      //cartão
      const paymentCC = new PaymentCreditCardEntity(
        PaymentType.Done,
        price,
        0,
        price,
        newOrder,
      );
      return this.PaymentRepository.save(paymentCC);
    } else if (newOrder.codePix && newOrder.datePayment) {
      //pix
      const paymentPix = new PaymentPixEntity(
        PaymentType.Processing,
        price,
        0,
        price,
        newOrder,
      );
      return this.PaymentRepository.save(paymentPix);
    }

    throw new BadRequestException(`Erro ao efetuar o pagamento`);
  }
}
