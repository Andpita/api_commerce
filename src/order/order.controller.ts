import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { UserId } from '../decorator/userId.decorator';
import { Roles } from '../decorator/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { ReturnOrderDTO } from './dtos/return-order.dto';
import { Response } from 'express';
import { OrderEntity } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() newOrder: CreateOrderDTO,
    @UserId() userId: number,
  ) {
    return this.orderService.createOrder(newOrder, userId);
  }

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Get()
  async myOrders(
    @UserId() userId: number,
    @Res({ passthrough: true }) res?: Response,
  ): Promise<ReturnOrderDTO[]> {
    const orders = await this.orderService
      .findMyOrders(userId)
      .catch(() => undefined);

    if (orders) {
      return orders.map((order: OrderEntity) => new ReturnOrderDTO(order));
    }

    res.status(204).send();

    return;
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/all')
  async allOrdersAdm(): Promise<ReturnOrderDTO[]> {
    return (await this.orderService.allOrders()).map(
      (order) => new ReturnOrderDTO(order),
    );
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/:orderId')
  async orderIdAdm(@Param('orderId') orderId: number): Promise<ReturnOrderDTO> {
    const order1 = new ReturnOrderDTO(
      (await this.orderService.findMyOrders(undefined, orderId))[0],
    );

    return order1;
  }
}
