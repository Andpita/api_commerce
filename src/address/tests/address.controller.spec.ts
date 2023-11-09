import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';
import { userMock } from '../../user/mocks/user.mock';
import { createAddressMock } from '../mocks/createAddress.mock';
import { addressMock } from '../mocks/address.mock';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn().mockResolvedValue(addressMock),
            findAllAddresses: jest.fn().mockResolvedValue([addressMock]),
          },
        },
      ],
      controllers: [AddressController],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(addressService).toBeDefined();
  });

  it('should return address Entity in create address (save)', async () => {
    const address = await controller.createAddress(
      createAddressMock,
      userMock.id,
    );

    expect(address).toEqual(addressMock);
  });

  it('should return All Addresses user in findAllAddresses (get)', async () => {
    const addresses = await controller.findAllAddresses(userMock.id);

    expect(addresses).toEqual([
      {
        ...addressMock,
        createdAt: undefined,
        updatedAt: undefined,
        cityId: undefined,
        userId: undefined,
      },
    ]);
  });
});
