import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from '../city.service';
import { CityController } from '../city.controller';
import { cityMock } from '../mocks/city.mock';
import { stateMock } from '../../state/mocks/state.mock';

describe('CityController', () => {
  let controller: CityController;
  let cityService: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CityService,
          useValue: {
            getAllCitiesByStateId: jest.fn().mockResolvedValue([cityMock]),
          },
        },
      ],
      controllers: [CityController],
    }).compile();

    controller = module.get<CityController>(CityController);
    cityService = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cityService).toBeDefined();
  });

  it('should return all cities for stateId (get)', async () => {
    const cities = await controller.getAllCitiesByStateId(stateMock.id);

    expect(cities).toEqual([cityMock]);
  });
});
