import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDTO } from './dtos/login.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ReturnLoginDTO } from './dtos/returnLogin.dto';
import { PayloadDTO } from './dtos/payload.dto';
import { ReturnUserDTO } from '../user/dtos/returnUser.dto';
import { decrypt } from '../utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginData: LoginDTO): Promise<ReturnLoginDTO> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginData.email)
      .catch(() => undefined);

    const isMatch = await decrypt(loginData.password, user?.password || '');

    if (!user || !isMatch) {
      throw new NotFoundException('E-mail ou senha inválido.');
    }

    return {
      accessToken: await this.jwtService.signAsync({ ...new PayloadDTO(user) }),
      user: new ReturnUserDTO(user),
    };
  }
}
