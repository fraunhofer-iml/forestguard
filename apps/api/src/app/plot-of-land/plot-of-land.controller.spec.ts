import { Test, TestingModule } from '@nestjs/testing';
import { PlotOfLandController } from './plot-of-land.controller';

describe('PlotOfLandController', () => {
  let controller: PlotOfLandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlotOfLandController],
    }).compile();

    controller = module.get<PlotOfLandController>(PlotOfLandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
