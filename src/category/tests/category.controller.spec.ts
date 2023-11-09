import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { categoryMock } from '../mocks/category.mock';
import { createCategoryMock } from '../mocks/createCategory.mock';
import { deleteCategory } from '../mocks/deleteCategory.mock';
import { updateCategoryMock } from '../mocks/updateCategory.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAllCategories: jest.fn().mockResolvedValue([categoryMock]),
            createCategory: jest.fn().mockResolvedValue(categoryMock),
            deleteCategory: jest.fn().mockResolvedValue(deleteCategory),
            updateCategory: jest.fn().mockResolvedValue({
              ...categoryMock,
              ...updateCategoryMock,
            }),
          },
        },
      ],
      controllers: [CategoryController],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('should return all categories (get)', async () => {
    const categories = await controller.findAllCategories();

    expect(categories).toEqual([categoryMock]);
  });

  it('should create a new category (post)', async () => {
    const categories = await controller.createCategory(createCategoryMock);

    expect(categories).toEqual({
      ...categoryMock,
      createdAt: undefined,
      updatedAt: undefined,
    });
  });

  it('should return delete result after delete category (delete)', async () => {
    const categories = await controller.deleteCategory(categoryMock.id);

    expect(categories).toEqual(deleteCategory);
  });

  it('should return update category (put)', async () => {
    const categories = await controller.updateCategory(
      categoryMock.id,
      updateCategoryMock,
    );

    expect(categories).toEqual({ ...categoryMock, ...updateCategoryMock });
  });
});
