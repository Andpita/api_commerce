import { userMock } from '../../user/mocks/user.mock';
import { ReturnLoginDTO } from '../dtos/returnLogin.dto';
import { jwtMock } from './jwt.mock';

export const returnLoginMock: ReturnLoginDTO = {
  accessToken: jwtMock,
  user: userMock,
};
