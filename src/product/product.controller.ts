import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from './../decorator/roles.decorator';
import { UserType } from './../user/enum/user-type.enum';
import { ReturnProductDTO } from './dtos/returnProduct.dto';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/createProduct.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProductDTO } from './dtos/updateProduct.dto';
import { Pagination } from '../page/dtos/pagination.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(UserType.User, UserType.Admin, UserType.Root)
  @Get('/page')
  async findAllPages(
    @Query('search') search?: string,
    @Query('size') size?: number,
    @Query('page') page?: number,
  ): Promise<Pagination<ReturnProductDTO[]>> {
    return this.productService.findAllPage(search, size, page);
  }

  @Roles(UserType.User, UserType.Admin, UserType.Root)
  @Get()
  @UsePipes(ValidationPipe)
  async findAllProducts(): Promise<ReturnProductDTO[]> {
    return (await this.productService.findAllProducts([], true)).map(
      (product) => new ReturnProductDTO(product),
    );
  }

  @Roles(UserType.User, UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Get('/:id')
  async findProductById(@Param('id') id: number): Promise<ReturnProductDTO> {
    return new ReturnProductDTO(await this.productService.findProductById(id));
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() product: CreateProductDTO,
  ): Promise<ReturnProductDTO> {
    return await this.productService.createProduct(product);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
  ): Promise<DeleteResult> {
    return await this.productService.deleteProductById(productId);
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Put('/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body()
    product: UpdateProductDTO,
  ): Promise<ReturnProductDTO> {
    return await this.productService.updateProduct(id, product);
  }

  @Get('/:productId/delivery/:cep')
  async getFrete(
    @Param('productId') productId: number,
    @Param('cep') cep: string,
  ) {
    return this.productService.frete(productId, cep);
  }
}
