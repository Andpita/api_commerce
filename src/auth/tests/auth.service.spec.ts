import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtMock } from '../mocks/jwt.mock';
import { loginMock } from '../mocks/login.mock';
import { userMock } from '../../user/mocks/user.mock';
import { ReturnUserDTO } from '../../user/dtos/returnUser.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(userMock),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: () => jwtMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  //Service e Repository
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user if password and email valid', async () => {
    const user = await service.login(loginMock);

    expect(user).toEqual({
      accessToken: jwtMock,
      user: new ReturnUserDTO(userMock),
    });
  });

  it('should return user if password invalid and email valid', async () => {
    expect(
      service.login({ ...loginMock, password: '123' }),
    ).rejects.toThrowError();
  });

  it('should return user if email not exist', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);

    expect(service.login(loginMock)).rejects.toThrowError();
  });

  it('should return error in UserService', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockRejectedValue(new Error());

    expect(service.login(loginMock)).rejects.toThrowError();
  });
});
