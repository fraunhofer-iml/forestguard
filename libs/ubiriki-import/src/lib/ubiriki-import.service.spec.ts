import { Test, TestingModule } from '@nestjs/testing';
import { UbirikiImportService } from './ubiriki-import.service';

describe('UbirikiImportService', () => {
  let service: UbirikiImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UbirikiImportService],
    }).compile();

    service = module.get<UbirikiImportService>(UbirikiImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
