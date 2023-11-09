import { categoryMock } from '../../category/mocks/category.mock';
import { ProductEntity } from '../entities/product.entity';

export const productMock: ProductEntity = {
  id: 123,
  categoryId: categoryMock.id,
  image: 'http://image/mockimage.img',
  name: 'MockTenis',
  price: 399.45,
  diameter: 0,
  height: 0,
  length: 0,
  weight: 0,
  width: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
