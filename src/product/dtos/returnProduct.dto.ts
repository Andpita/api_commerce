import { ReturnCategoryDTO } from '../../category/dtos/returnCategory.dto';
import { ProductEntity } from '../entities/product.entity';

export class ReturnProductDTO {
  id: number;
  name: string;
  price: number;
  image: string;
  weight: number;
  categoryId: number;
  category?: ReturnCategoryDTO;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.image = product.image;
    this.weight = product.weight;
    this.categoryId = product.categoryId;
    this.category = product.category
      ? new ReturnCategoryDTO(product.category)
      : undefined;
  }
}
