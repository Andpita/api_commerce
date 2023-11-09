import { cityMock } from '../../city/mocks/city.mock';
import { stateMock } from '../../state/mocks/state.mock';

export const returnCorreiosMock = {
  cep: '00000-000',
  publicPlace: '',
  complement: '',
  neigborhood: '',
  city: cityMock.name,
  uf: stateMock.uf,
  ddd: '00',
  cityId: cityMock.id,
  stateId: stateMock.id,
};
