import { stateMock } from '../../state/mocks/state.mock';
import { CityEntity } from '../entities/city.entity';

export const cityAndRelationsMock: CityEntity = {
  createdAt: new Date(),
  id: 234,
  name: 'cityMock',
  stateId: stateMock.id,
  updatedAt: new Date(),
};
