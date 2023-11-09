import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { UserType } from '../user/enum/user-type.enum';
import { Roles } from '../decorator/roles.decorator';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { ReturnCategoryDTO } from './dtos/returnCategory.dto';
import { DeleteResult } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(UserType.User, UserType.Admin, UserType.Root)
  @Get()
  @UsePipes(ValidationPipe)
  async findAllCategories(): Promise<ReturnCategoryDTO[]> {
    return await this.categoryService.findAllCategories();
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get(':id')
  @UsePipes(ValidationPipe)
  async findOneCategoryById(
    @Param('id') id: number,
  ): Promise<ReturnCategoryDTO> {
    return await this.categoryService.findOneCategoryById(id, true);
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(
    @Body() nameCategory: CreateCategoryDTO,
  ): Promise<ReturnCategoryDTO> {
    return new ReturnCategoryDTO(
      await this.categoryService.createCategory(nameCategory),
    );
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Delete(':categoryId')
  async deleteCategory(
    @Param('categoryId') idCategory: number,
  ): Promise<DeleteResult> {
    return this.categoryService.deleteCategory(idCategory);
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Put(':categoryId')
  async updateCategory(
    @Param('categoryId') idCategory: number,
    @Body() update: CreateCategoryDTO,
  ): Promise<CategoryEntity> {
    return this.categoryService.updateCategory(idCategory, update);
  }
}
