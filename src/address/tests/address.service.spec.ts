import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressService } from '../address.service';
import { AddressEntity } from '../entities/address.entity';
import { addressMock } from '../mocks/address.mock';
import { UserService } from '../../user/user.service';
import { userMock } from '../../user/mocks/user.mock';
import { CityService } from '../../city/city.service';
import { cityMock } from '../../city/mocks/city.mock';
import { createAddressMock } from '../mocks/createAddress.mock';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: Repository<AddressEntity>;
  let userService: UserService;
  let cityService: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockResolvedValue(userMock),
          },
        },
        {
          provide: CityService,
          useValue: {
            findCityById: jest.fn().mockResolvedValue(cityMock),
          },
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(addressMock),
            find: jest.fn().mockResolvedValue([addressMock]),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    userService = module.get<UserService>(UserService);
    cityService = module.get<CityService>(CityService);
    addressRepository = module.get(getRepositoryToken(AddressEntity));
  });

  //Service e Repository
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(cityService).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  it('should return address after save', async () => {
    const address = await service.createAddress(createAddressMock, userMock.id);

    expect(address).toEqual(addressMock);
  });

  it('should return error if exception in userService', async () => {
    jest.spyOn(userService, 'findUserById').mockRejectedValue(new Error());

    expect(
      service.createAddress(createAddressMock, userMock.id),
    ).rejects.toThrowError();
  });

  it('should return error if exception in cityService', async () => {
    jest.spyOn(cityService, 'findCityById').mockRejectedValue(new Error());

    expect(
      service.createAddress(createAddressMock, userMock.id),
    ).rejects.toThrowError();
  });

  it('should return all addresses to user', async () => {
    const addresses = await service.findAllAddresses(userMock.id);

    expect(addresses).toEqual([addressMock]);
  });

  it('should return not found addresses', async () => {
    jest.spyOn(addressRepository, 'find').mockResolvedValue(undefined);

    expect(service.findAllAddresses(userMock.id)).rejects.toThrowError();
  });
});
