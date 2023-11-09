import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDTO } from './dtos/createAddress.dto';
import { UserService } from '../user/user.service';
import { CityService } from '../city/city.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UserService,
    private readonly cityService: CityService,
  ) {}

  async createAddress(
    address: CreateAddressDTO,
    userId: number,
  ): Promise<AddressEntity> {
    //Validação User Id;
    await this.userService.findUserById(userId);
    //Validação City Id;
    await this.cityService.findCityById(address.cityId);

    return this.addressRepository.save({
      ...address,
      userId,
    });
  }

  async findAllAddresses(userId: number): Promise<AddressEntity[]> {
    const addresses = await this.addressRepository.find({
      where: {
        userId,
      },
      relations: {
        city: {
          state: true,
        },
      },
    });

    if (!addresses || addresses.length === 0) {
      throw new NotFoundException(
        `Nenhum endereço cadastrado para userId ${userId}`,
      );
    }

    return addresses;
  }
}
