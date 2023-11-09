import { cityMock } from '../../city/mocks/city.mock';
import { AddressEntity } from '../entities/address.entity';
import { userMock } from '../../user/mocks/user.mock';

export const addressMock: AddressEntity = {
  cep: '88000-000',
  cityId: cityMock.id,
  complement: 'House',
  createdAt: new Date(),
  id: 345,
  numberAddress: 157,
  updatedAt: new Date(),
  userId: userMock.id,
};
