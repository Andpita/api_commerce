import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { productMock } from '../mocks/product.mock';
import { ILike, In, Repository } from 'typeorm';
import { CategoryService } from '../../category/category.service';
import { categoryMock } from '../../category/mocks/category.mock';
import { productDeleteMock } from '../mocks/productDelete.mock';
import { updateProductMock } from '../mocks/updateProduct.mock';
import { BadRequestException } from '@nestjs/common';
import { CorreiosService } from '../../correios/correios.service';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryService: CategoryService;
  let correiosService: CorreiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(productMock),
            find: jest.fn().mockResolvedValue([productMock]),
            findAndCount: jest.fn().mockResolvedValue([[productMock], 1]),
            findOne: jest.fn().mockResolvedValue(productMock),
            delete: jest.fn().mockResolvedValue(productDeleteMock),
            put: jest.fn().mockResolvedValue(productMock),
          },
        },
        CategoryService,
        {
          provide: CategoryService,
          useValue: {
            findOneCategoryById: jest.fn().mockResolvedValue(categoryMock.id),
          },
        },
        CorreiosService,
        {
          provide: CorreiosService,
          useValue: {
            calcFrete: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(ProductEntity));
    categoryService = module.get<CategoryService>(CategoryService);
    correiosService = module.get<CorreiosService>(CorreiosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(correiosService).toBeDefined();
  });

  //Create New Product
  it('should return product after save', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);
    jest
      .spyOn(categoryService, 'findOneCategoryById')
      .mockResolvedValue(categoryMock);

    const product = await service.createProduct(productMock);

    expect(product).toEqual(productMock);
  });

  it('should return error if categoty not exist', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(productMock);
    jest
      .spyOn(categoryService, 'findOneCategoryById')
      .mockResolvedValue(undefined);

    expect(service.createProduct(productMock)).rejects.toThrowError();
  });

  it('should return error if product exist', async () => {
    expect(service.createProduct(productMock)).rejects.toThrowError();
  });

  it('should return error to create new product', async () => {
    jest.spyOn(productRepository, 'save').mockRejectedValue(new Error());

    expect(service.createProduct(productMock)).rejects.toThrowError();
  });

  //List All Products
  it('should return list all products', async () => {
    const productsAll = await service.findAllProducts();

    expect(productsAll).toEqual([productMock]);
  });

  it('should return list all products with relations', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const productsAll = await service.findAllProducts([], true);

    expect(productsAll).toEqual([productMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      relations: { category: true },
    });
  });

  it('should return list all products with relations and array', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const productsAll = await service.findAllProducts([1], true);

    expect(productsAll).toEqual([productMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: In([1]),
      },
      relations: { category: true },
    });
  });

  it('should return error in list products empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValue([]);

    expect(service.findAllProducts()).rejects.toThrow();
  });

  it('should return error if exception in products', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllProducts()).rejects.toThrow();
  });

  //FindOneProductByName
  it('should return list all products', async () => {
    const product = await service.findProductByName(productMock.name);

    expect(product).toEqual(productMock);
  });

  it('should return error if not found product', async () => {
    jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findProductByName(productMock.name)).rejects.toThrow();
    expect(service.findProductById(productMock.id)).rejects.toThrow();
  });

  it('should return error if not found product', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findProductByName(productMock.name)).rejects.toThrow();
    expect(service.findProductById(productMock.id)).rejects.toThrow();
  });

  it('should return error if exception in product', async () => {
    jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findProductByName(productMock.name)).rejects.toThrow();
    expect(service.findProductById(productMock.id)).rejects.toThrow();
  });

  //FindOneProductById
  it('should return list all products', async () => {
    const product = await service.findProductById(productMock.id);

    expect(product).toEqual(productMock);
  });

  //Delete product
  it('should return delete result if delete product', async () => {
    const product = await service.deleteProductById(productMock.id);

    expect(product).toEqual(productDeleteMock);
  });

  it('should return error if product not fount for delete', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.deleteProductById(productMock.id)).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('should return error if exception in product delete', async () => {
    jest.spyOn(productRepository, 'delete').mockRejectedValue(new Error());

    expect(service.deleteProductById(productMock.id)).rejects.toThrowError();
  });

  //Update product
  it('should return products after update', async () => {
    const product = await service.updateProduct(
      productMock.id,
      updateProductMock,
    );

    expect(product).toEqual(productMock);
  });

  it('should return error if exception in product update', async () => {
    jest.spyOn(productRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.updateProduct(productMock.id, updateProductMock),
    ).rejects.toThrowError();
  });

  it('should return error if not found product for update', async () => {
    jest.spyOn(productRepository, 'findOne').mockRejectedValue(undefined);

    expect(
      service.updateProduct(productMock.id, updateProductMock),
    ).rejects.toThrowError();
  });

  it('should return product pagination', async () => {
    const result = await service.findAllPage();

    expect(result.data).toEqual([productMock]);
    expect(result.meta).toEqual({
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 1,
      totalPages: 1,
    });
  });

  it('should return product pagination send size and page', async () => {
    const size = 123;
    const page = 321;
    const result = await service.findAllPage(undefined, size, page);

    expect(result.data).toEqual([productMock]);
    expect(result.meta).toEqual({
      currentPage: page,
      itemsPerPage: size,
      totalItems: 1,
      totalPages: 1,
    });
  });

  it('should return product pagination send size and page', async () => {
    const search = 'searchTest';
    const spy = jest.spyOn(productRepository, 'findAndCount');
    await service.findAllPage(search);

    expect(spy.mock.calls[0][0].where).toEqual({ name: ILike(`%${search}%`) });
  });

  it('should return delivery values', async () => {
    const spy = jest.spyOn(correiosService, 'calcFrete');
    await service.frete(productMock.id, '00000-000');

    expect(spy.mock.calls.length).toEqual(1);
  });
});
