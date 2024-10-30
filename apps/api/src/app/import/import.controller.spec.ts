import { Test, TestingModule } from '@nestjs/testing';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';

describe('ImportController', () => {
  let controller: ImportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportController],
      providers: [
        {
          provide: ImportService,
          useValue: {
            importMasterData: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
          },
        },
      ],
    }).compile();

    controller = module.get<ImportController>(ImportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
