import { categoryMock } from '../../category/mocks/category.mock';
import { UpdateProductDTO } from '../dtos/updateProduct.dto';

export const updateProductMock: UpdateProductDTO = {
  categoryId: categoryMock.id,
  image: 'http://image/mockimage.img',
  name: 'MockTenis2',
  price: 199.9,
};
