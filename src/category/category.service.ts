import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { ProductService } from '../product/product.service';
import { ReturnCategoryDTO } from './dtos/returnCategory.dto';
import { CountProductDTO } from '../product/dtos/countProduct.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  findAmountCategoryInProducts(
    category: CategoryEntity,
    countList: CountProductDTO[],
  ): number {
    const count = countList.find(
      (itemCount) => itemCount.category_id === category.id,
    );

    if (count) {
      return +count.total;
    }

    return 0;
  }

  async findAllCategories(): Promise<ReturnCategoryDTO[]> {
    const categories = await this.categoryRepository.find();

    const count = await this.productService.countProductByCategoryId();

    if (!categories || categories.length === 0) {
      throw new NotFoundException(`Nenhuma categoria encontrada`);
    }

    return categories.map(
      (category) =>
        new ReturnCategoryDTO(
          category,
          this.findAmountCategoryInProducts(category, count),
        ),
    );
  }

  async findOneCategory(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });

    if (!category) {
      throw new BadRequestException(`Categoria ${name} não encontrada`);
    }

    return category;
  }

  async findOneCategoryById(
    id: number,
    isRelations?: boolean,
  ): Promise<CategoryEntity> {
    const relations = isRelations ? { product: true } : undefined;

    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      relations,
    });

    if (!category) {
      throw new BadRequestException(`Categoria ${id} não encontrada`);
    }

    return category;
  }

  async createCategory(category: CreateCategoryDTO): Promise<CategoryEntity> {
    const categoryCheck = await this.findOneCategory(category.name).catch(
      () => undefined,
    );

    if (categoryCheck) {
      throw new BadRequestException(`Categoria já cadastrada`);
    }

    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<DeleteResult> {
    const category = await this.findOneCategoryById(id, true);

    if (category.product?.length > 0) {
      throw new BadRequestException('A categoria possui produtos cadastrados.');
    }

    return await this.categoryRepository.delete(category.id);
  }

  async updateCategory(
    idCategory: number,
    update: CreateCategoryDTO,
  ): Promise<CategoryEntity> {
    const category = await this.findOneCategoryById(idCategory);

    return await this.categoryRepository.save({
      ...category,
      name: update.name,
    });
  }
}
