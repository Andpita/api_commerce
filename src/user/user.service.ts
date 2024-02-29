import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from '../user/dtos/createUser.dto';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserType } from './enum/user-type.enum';
import { UpdatePasswordDTO } from './dtos/updatePassword.dto';
import { createHashPassword, decrypt } from '../utils/password';
import { UpdateUserDTO } from './dtos/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(
    createUser: CreateUserDTO,
    typeUser?: number,
  ): Promise<UserEntity> {
    const userCheck = await this.findUserByEmail(createUser.email).catch(
      () => undefined,
    );

    if (userCheck) {
      throw new BadRequestException(`E-mail já cadastrado`);
    }

    const _password = await createHashPassword(createUser.password);

    return this.userRepository.save({
      ...createUser,
      password: _password,
      typeUser: typeUser ? typeUser : UserType.User,
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário (${userId}) não encontrado`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`(${email}) não existe`);
    }

    return user;
  }

  async updateUserPassword(
    userId: number,
    updatePassword: UpdatePasswordDTO,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    const _password = await createHashPassword(updatePassword.newPassword);

    const isMatch = await decrypt(
      updatePassword.oldPassword,
      user.password || '',
    );

    if (!isMatch) {
      throw new BadRequestException('Última senha inválida');
    }

    return this.userRepository.save({
      ...user,
      password: _password,
    });
  }

  async updateUser(
    userId: number,
    updateUser: UpdateUserDTO,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);
    const userPass = user.password;

    const isMatch = await decrypt(updateUser.password, user.password || '');

    if (!isMatch) {
      throw new BadRequestException('Senha inválida');
    }

    return this.userRepository.save({
      ...user,
      ...updateUser,
      password: userPass,
    });
  }
}
