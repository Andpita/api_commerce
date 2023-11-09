import { UserEntity } from '../../user/entities/user.entity';

export class PayloadDTO {
  id: number;
  typeUser: number;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.typeUser = user.typeUser;
  }
}
