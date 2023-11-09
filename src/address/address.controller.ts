import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAddressDTO } from './dtos/createAddress.dto';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { Roles } from '../decorator/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { UserId } from '../decorator/userId.decorator';
import { ReturnAddressDTO } from './dtos/returnAddress.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Roles(UserType.User)
  @Post()
  @UsePipes(ValidationPipe)
  async createAddress(
    @Body() address: CreateAddressDTO,
    @UserId() userId: number,
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(address, userId);
  }

  @Roles(UserType.User, UserType.Admin, UserType.Root)
  @Get()
  @UsePipes(ValidationPipe)
  async findAllAddresses(
    @UserId() userId: number,
  ): Promise<ReturnAddressDTO[]> {
    return (await this.addressService.findAllAddresses(userId)).map(
      (address) => new ReturnAddressDTO(address),
    );
  }
}
