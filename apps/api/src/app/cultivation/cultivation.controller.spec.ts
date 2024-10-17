import { Test, TestingModule } from '@nestjs/testing';
import { CultivationController } from './cultivation.controller';
import { CultivationService } from './cultivation.service';

describe('CultivationController', () => {
  let controller: CultivationController;
  let service: CultivationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultivationController],
      providers: [
        {
          provide: CultivationService,
          useValue: {
            readCultivationsByCommodity: jest.fn().mockImplementation((type) => Promise.resolve({ type })),
          },
        },
      ],
    }).compile();

    controller = module.get<CultivationController>(CultivationController);
    service = module.get<CultivationService>(CultivationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
