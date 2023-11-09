import { categoryMock } from '../../category/mocks/category.mock';
import { CreateProductDTO } from '../dtos/createProduct.dto';

export const createProductMock: CreateProductDTO = {
  categoryId: categoryMock.id,
  image: 'http://image/mockimage.img',
  name: 'MockTenis',
  price: 399.9,
  diameter: 0,
  height: 0,
  length: 0,
  width: 0,
  weight: 0,
};
