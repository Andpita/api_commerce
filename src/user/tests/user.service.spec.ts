import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userMock } from '../mocks/user.mock';
import { createUserMock } from '../mocks/createUser.mock';
import {
  updatePasswordInvalidMock,
  updatePasswordMock,
} from '../mocks/updatePassword.mock';
import { UserType } from '../enum/user-type.enum';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userMock),
            find: jest.fn().mockResolvedValue([userMock]),
            save: jest.fn().mockResolvedValue(userMock),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  //Service e Repository
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  //FindUserByEmail
  it('should return in findUserByEmail', async () => {
    const user = await service.findUserByEmail(userMock.email);

    expect(user).toEqual(userMock);
  });

  it('should return error in findUserByEmail', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findUserByEmail(userMock.email)).rejects.toThrowError();
  });

  it('should return error in findUserByEmail (Erro DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findUserByEmail(userMock.email)).rejects.toThrowError();
  });

  //FindUserById
  it('should return in findUserById', async () => {
    const user = await service.findUserById(userMock.id);

    expect(user).toEqual(userMock);
  });

  it('should return error in findUserById', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findUserById(userMock.id)).rejects.toThrowError();
  });

  it('should return error in findUserById (Erro DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findUserById(userMock.id)).rejects.toThrowError();
  });

  //getUserByIdUsingRelations
  it('should return in getUserByIdUsingRelations', async () => {
    const user = await service.getUserByIdUsingRelations(userMock.id);

    expect(user).toEqual(userMock);
  });

  it('should return relations in getUserByIdUsingRelations', async () => {
    const spy = jest.spyOn(userRepository, 'findOne');
    const user = await service.getUserByIdUsingRelations(userMock.id);

    expect(user).toEqual(userMock);
    expect(spy.mock.calls[0][0].relations).toEqual({
      addresses: {
        city: {
          state: true,
        },
      },
    });
  });

  //Create User
  it('should return error if user exist', async () => {
    expect(service.createUser(createUserMock)).rejects.toThrowError();
  });

  it('should return new user if user not exist', async () => {
    const spy = jest.spyOn(userRepository, 'save');
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const user = await service.createUser(createUserMock);

    expect(user).toEqual(userMock);
    expect(spy.mock.calls[0][0].typeUser).toEqual(UserType.User);
  });

  it('should return new admin if user not exist', async () => {
    const spy = jest.spyOn(userRepository, 'save');
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const user = await service.createUser(createUserMock, UserType.Admin);

    expect(user).toEqual(userMock);
    expect(spy.mock.calls[0][0].typeUser).toEqual(UserType.Admin);
  });

  //Update User
  it('should return user in update password', async () => {
    const user = await service.updateUserPassword(
      userMock.id,
      updatePasswordMock,
    );

    expect(user).toEqual(userMock);
  });

  it('should return invalid password user in update password', async () => {
    expect(
      service.updateUserPassword(userMock.id, updatePasswordInvalidMock),
    ).rejects.toThrowError();
  });

  it('should return error if user not exist in update password', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error());

    expect(
      service.updateUserPassword(userMock.id, updatePasswordInvalidMock),
    ).rejects.toThrowError();
  });

  //Get All Users
  it('should return all user exist', async () => {
    const users = await service.getAllUsers();

    expect(users).toEqual([userMock]);
  });
});
