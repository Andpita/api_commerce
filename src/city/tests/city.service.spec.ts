import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityService } from '../city.service';
import { CityEntity } from '../entities/city.entity';
import { CacheService } from '../../cache/cache.service';
import { cityMock } from '../mocks/city.mock';
import { stateMock } from '../../state/mocks/state.mock';
import { cityAndRelationsMock } from '../mocks/cityAndRelations.mock';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<CityEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue([cityMock]),
          },
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([cityMock]),
            findOne: jest.fn().mockResolvedValue(cityMock),
            save: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get(getRepositoryToken(CityEntity));
  });

  //Service e Repository
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cityRepository).toBeDefined();
  });

  //findOne
  it('should return city by id', async () => {
    const city = await service.findCityById(cityMock.id);

    expect(city).toEqual(cityMock);
  });

  it('should return error in city by id undefined', async () => {
    jest.spyOn(cityRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCityById(cityMock.id)).rejects.toThrowError();
  });

  //FindAll
  it('should return cities in getAllCitiesByStateId', async () => {
    const cities = await service.getAllCitiesByStateId(cityMock.id);

    expect(cities).toEqual([cityMock]);
  });

  it('should return cities in getAllCitiesByStateId with relations', async () => {
    const cities = await service.getAllCitiesByStateId(cityMock.id);

    expect(cities).toEqual([cityMock]);
  });

  //FindRelations
  it('should return city by name and relations', async () => {
    const city = await service.findCityByName(cityMock.name, stateMock.uf);

    expect(city).toEqual({
      ...cityAndRelationsMock,
      updatedAt: cityMock.updatedAt,
      createdAt: cityMock.updatedAt,
    });
  });
});
