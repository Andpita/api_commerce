import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryMock } from '../mocks/category.mock';
import { createCategoryMock } from '../mocks/createCategory.mock';
import { ProductService } from '../../product/product.service';
import { countMock } from '../../product/mocks/counterProduct.mock';
import { ReturnCategoryDTO } from '../dtos/returnCategory.dto';
import { updateCategoryMock } from '../mocks/updateCategory.mock';
import { deleteCategory } from '../mocks/deleteCategory.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(categoryMock),
            find: jest.fn().mockResolvedValue([categoryMock]),
            findOne: jest.fn().mockResolvedValue(categoryMock),
            delete: jest.fn().mockResolvedValue(deleteCategory),
          },
        },
        {
          provide: ProductService,
          useValue: {
            countProductByCategoryId: jest.fn().mockResolvedValue([countMock]),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get(getRepositoryToken(CategoryEntity));
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  //FindAll
  it('should return list all categories', async () => {
    const categories = await service.findAllCategories();

    expect(categories).toEqual([
      new ReturnCategoryDTO(categoryMock, countMock.total),
    ]);
  });

  it('should return error in list categories empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);

    expect(service.findAllCategories()).rejects.toThrow();
  });

  it('should return error if exception in categoryRepository', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllCategories()).rejects.toThrowError();
  });

  //Save
  it('should return category after save', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    const category = await service.createCategory(createCategoryMock);

    expect(category).toEqual(categoryMock);
  });

  it('should return error in exception in createCategory', async () => {
    jest.spyOn(categoryRepository, 'save').mockRejectedValue(new Error());

    expect(service.createCategory(createCategoryMock)).rejects.toThrowError();
  });

  it('should return error if duplicate name category', async () => {
    expect(service.createCategory(createCategoryMock)).rejects.toThrowError();
  });

  //FindOne
  it('should return one category by name', async () => {
    const category = await service.findOneCategory(categoryMock.name);

    expect(category).toEqual(categoryMock);
  });

  it('should return one category by id', async () => {
    const category = await service.findOneCategoryById(categoryMock.id);

    expect(category).toEqual(categoryMock);
  });

  it('should return error category by name not exist', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findOneCategory(categoryMock.name)).rejects.toThrowError();
  });

  it('should return error category by id not exist', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findOneCategoryById(categoryMock.id)).rejects.toThrowError();
  });

  it('should return error exception category findOne', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findOneCategory(categoryMock.name)).rejects.toThrowError();
  });

  it('should return error exception category findOne', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findOneCategory(categoryMock.name)).rejects.toThrowError();
  });

  //Delete
  it('should return delete category', async () => {
    const deleteC = await service.deleteCategory(categoryMock.id);

    expect(deleteC).toEqual(deleteCategory);
  });

  it('should return error in delete category if createCategory', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.deleteCategory(categoryMock.id)).rejects.toThrowError();
  });

  //update
  it('should return update category name', async () => {
    const find = jest.spyOn(categoryRepository, 'findOne');
    const save = jest.spyOn(categoryRepository, 'save');
    const category = await service.updateCategory(
      categoryMock.id,
      updateCategoryMock,
    );

    expect(category).toEqual(categoryMock);
    expect(find.mock.calls.length).toEqual(1);
    expect(save.mock.calls.length).toEqual(1);
  });
});
