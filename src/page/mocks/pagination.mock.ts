import { ProductEntity } from 'src/product/entities/product.entity';
import { Pagination } from '../dtos/pagination.dto';
import { productMock } from '../../product/mocks/product.mock';

export const paginationMock: Pagination<ProductEntity[]> = {
  meta: { currentPage: 1, itemsPerPage: 10, totalItems: 18, totalPages: 2 },
  data: [productMock],
};
