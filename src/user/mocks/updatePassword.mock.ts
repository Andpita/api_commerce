import { UpdatePasswordDTO } from '../dtos/updatePassword.dto';

export const updatePasswordMock: UpdatePasswordDTO = {
  oldPassword: 'abc',
  newPassword: '123',
};

export const updatePasswordInvalidMock: UpdatePasswordDTO = {
  oldPassword: 'cba',
  newPassword: '123',
};
