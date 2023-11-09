import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosController } from '../correios.controller';
import { CorreiosService } from '../correios.service';
import { returnCorreiosMock } from '../mocks/returnInfoCorreios.mock';

describe('CorreiosController', () => {
  let controller: CorreiosController;
  let correiosService: CorreiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CorreiosService,
          useValue: {
            getFrete: jest.fn().mockResolvedValue(0),
            findAddressByCEP: jest.fn().mockResolvedValue(returnCorreiosMock),
          },
        },
      ],
      controllers: [CorreiosController],
    }).compile();

    controller = module.get<CorreiosController>(CorreiosController);
    correiosService = module.get<CorreiosService>(CorreiosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(correiosService).toBeDefined();
  });

  it('should return correios local', async () => {
    const local = await controller.findCep(returnCorreiosMock.cep);

    expect(local).toEqual(returnCorreiosMock);
  });
});
