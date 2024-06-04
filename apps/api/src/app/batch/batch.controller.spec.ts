import { Test, TestingModule } from '@nestjs/testing';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';

describe('BatchController', () => {
  let controller: BatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchController],
      providers: [
        {
          provide: BatchService,
          useValue: {
            createHarvests: jest.fn().mockImplementation((dto) => Promise.resolve({ dto })),
          },
        },
      ],
    }).compile();

    controller = module.get<BatchController>(BatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
