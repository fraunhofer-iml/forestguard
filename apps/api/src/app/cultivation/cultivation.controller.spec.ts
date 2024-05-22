import { Test, TestingModule } from '@nestjs/testing';
import { CultivationController } from './cultivation.controller';

describe('CultivationController', () => {
  let controller: CultivationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultivationController],
    }).compile();

    controller = module.get<CultivationController>(CultivationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
