import { Test, TestingModule } from '@nestjs/testing';
import { BatchService } from '../batch.service';
import { mockedPrismaBatch1, mockedPrismaBatch2, mockedPrismaBatch3, mockedPrismaBatch4 } from '../mocked-data/batch.mock';
import { RelatedBatchesService } from './related-batches.service';

describe('BatchService', () => {
  let service: RelatedBatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelatedBatchesService,
        {
          provide: BatchService,
          useValue: {
            getBatchById: (id: string) => {
              if (id === '1') {
                return mockedPrismaBatch1;
              }
              if (id === '2') return mockedPrismaBatch2;
              if (id === '3') return mockedPrismaBatch3;
              if (id === '4') return mockedPrismaBatch4;
            },
          },
        },
      ],
    }).compile();

    service = module.get<RelatedBatchesService>(RelatedBatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should read all related batches by batch ID', async () => {
    const testBatchId = '1';
    const resultEdges = [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '2', to: '4' },
    ];

    const result = await service.readRelatedBatchesById(testBatchId);

    expect(result.edges).toEqual(resultEdges);
  });
});
