import { cityMock } from '../../city/mocks/city.mock';
import { CreateAddressDTO } from '../dtos/createAddress.dto';
import { addressMock } from './address.mock';

export const createAddressMock: CreateAddressDTO = {
  cep: addressMock.cep,
  cityId: cityMock.id,
  complement: addressMock.complement,
  numberAddress: addressMock.numberAddress,
};
