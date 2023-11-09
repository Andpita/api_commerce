import { Test, TestingModule } from '@nestjs/testing';
import { StateService } from '../state.service';
import { StateController } from '../state.controller';
import { stateMock } from '../mocks/state.mock';

describe('StateController', () => {
  let controller: StateController;
  let stateService: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: StateService,
          useValue: {
            getAllState: jest.fn().mockResolvedValue([stateMock]),
          },
        },
      ],
      controllers: [StateController],
    }).compile();

    controller = module.get<StateController>(StateController);
    stateService = module.get<StateService>(StateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(stateService).toBeDefined();
  });

  it('should return all states (get)', async () => {
    const state = await controller.getAllState();

    expect(state).toEqual([stateMock]);
  });
});
