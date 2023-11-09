import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult, ILike, In, Repository } from 'typeorm';
import { CreateProductDTO } from './dtos/createProduct.dto';
import { CategoryService } from './../category/category.service';
import { UpdateProductDTO } from './dtos/updateProduct.dto';
import { CountProductDTO } from './dtos/countProduct.dto';
import { CorreiosService } from '../correios/correios.service';
import { ReturnProductDTO } from './dtos/returnProduct.dto';
import { Pagination, PaginationMeta } from '..//page/dtos/pagination.dto';

const DEFAULT_SIZE_PAGE = 10;
const DEFAULT_PAGE = 1;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    private readonly correiosService: CorreiosService,
  ) {}

  //create
  async createProduct(product: CreateProductDTO): Promise<ProductEntity> {
    const productCheck = await this.findProductByName(product.name).catch(
      () => undefined,
    );

    await this.categoryService.findOneCategoryById(product.categoryId);

    if (productCheck) {
      throw new BadRequestException(`Produto ${product.name} já cadastrado`);
    }

    return await this.productRepository.save({
      ...product,
      weight: product.weight || 0,
      height: product.height || 0,
      diameter: product.diameter || 0,
      width: product.width || 0,
      length: product.length || 0,
    });
  }

  //find
  async findProductByName(name: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        name,
      },
    });

    if (!product) {
      throw new BadRequestException(`Produto ${name} não encontrado`);
    }

    return product;
  }

  async findProductById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: { category: true },
    });

    if (!product) {
      throw new BadRequestException(`Produto ${id} não encontrado`);
    }

    return product;
  }

  //findAll
  async findAllProducts(
    productId?: number[],
    relationsCategory?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    if (relationsCategory) {
      findOptions = { ...findOptions, relations: { category: true } };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException(`Nenhum produto encontrado`);
    }

    return products;
  }

  async findAllPage(
    search?: string,
    size: number = DEFAULT_SIZE_PAGE,
    page: number = DEFAULT_PAGE,
  ): Promise<Pagination<ProductEntity[]>> {
    let findOptions = {};

    if (!page || page < 0) {
      page = 1;
    }

    if (search) {
      findOptions = {
        where: {
          name: ILike(`%${search}%`),
        },
      };
    }

    const [products, total] = await this.productRepository.findAndCount({
      ...findOptions,
      take: size,
      skip: (page - 1) * size,
    });

    return new Pagination(
      new PaginationMeta(
        Number(size),
        total,
        Number(page),
        Math.ceil(total / size),
      ),
      products,
    );
  }

  //delete
  async deleteProductById(id: number): Promise<DeleteResult> {
    const productDelete = await this.findProductById(id);

    if (!productDelete) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }

    return await this.productRepository.delete(id);
  }

  //update
  async updateProduct(
    idProduct: number,
    updateProduct: UpdateProductDTO,
  ): Promise<ProductEntity> {
    const product = await this.findProductById(idProduct).catch(
      () => undefined,
    );

    if (!product) {
      throw new BadRequestException(`Produto ${idProduct} não encontrado`);
    }

    await this.categoryService.findOneCategoryById(updateProduct.categoryId);

    return await this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }

  //Count Products (GET)
  async countProductByCategoryId(): Promise<CountProductDTO[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id, COUNT(*) as total')
      .groupBy('product.category_id')
      .getRawMany();
  }

  //GET Delivery (GET)
  async frete(productId: number, cep: string): Promise<any> {
    const product = new ReturnProductDTO(await this.findProductById(productId));
    const delivery = await this.correiosService.calcFrete(cep, product.weight);

    return { ...product, ...delivery };
  }
}
