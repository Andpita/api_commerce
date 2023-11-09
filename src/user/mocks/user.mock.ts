import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/user-type.enum';

export const userMock: UserEntity = {
  name: 'UserMock',
  email: 'emailmock@emali.com',
  phone: '48999002020',
  password: '$2b$10$S62WmVpIxL52Z.0y22DWfuaAz8.XUNESChWP.AlMFZnOJ9n9uiqi.',
  cpf: '12312312300',
  createdAt: new Date(),
  updatedAt: new Date(),
  typeUser: UserType.User,
  id: 6212,
};
