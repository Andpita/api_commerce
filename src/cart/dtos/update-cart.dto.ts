import { IsNumber } from 'class-validator';

export class UpdateProductCartDTO {
  @IsNumber()
  productId: number;

  @IsNumber()
  amount: number;
}
