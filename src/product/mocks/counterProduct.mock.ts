import { categoryMock } from '../../category/mocks/category.mock';
import { CountProductDTO } from '../dtos/countProduct.dto';

export const countMock: CountProductDTO = {
  category_id: categoryMock.id,
  total: 3,
};
