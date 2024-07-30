import { Test, TestingModule } from '@nestjs/testing';
import {
  mockedPrismaBatch1,
  mockedPrismaBatch2,
  mockedPrismaBatch3,
  mockedPrismaBatch4,
} from '../mocked-data/batch.mock';
import { BatchReadRelatedService } from './batch-read-related.service';
import { PrismaService } from '@forrest-guard/database';

describe('BatchReadRelatedService', () => {
  let service: BatchReadRelatedService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchReadRelatedService,
        {
          provide: PrismaService,
          useValue: {
            batch: {
              findUniqueOrThrow: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BatchReadRelatedService>(BatchReadRelatedService);
    prisma = module.get<PrismaService>(PrismaService);
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

    jest.spyOn(prisma.batch, 'findUniqueOrThrow')
      .mockResolvedValueOnce(mockedPrismaBatch1)
      .mockResolvedValueOnce(mockedPrismaBatch2)
      .mockResolvedValueOnce(mockedPrismaBatch3)
      .mockResolvedValueOnce(mockedPrismaBatch4);

    const result = await service.readRelatedBatchesById(testBatchId);

    expect(result.edges).toEqual(resultEdges);
  });
});
