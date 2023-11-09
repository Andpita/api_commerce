import { ReturnUserDTO } from '../../user/dtos/returnUser.dto';

export class ReturnLoginDTO {
  user: ReturnUserDTO;
  accessToken: string;
}
