import { userMock } from '../../user/mocks/user.mock';
import { LoginDTO } from '../dtos/login.dto';

export const loginMock: LoginDTO = {
  email: userMock.email,
  password: 'abc',
};
