import { BatchCreateDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { Test, TestingModule } from '@nestjs/testing';
import { Process } from '@prisma/client';
import { BatchService } from './batch.service';
import { mockedPrismaBatchWithRelations1, mockedPrismaBatchWithRelations2 } from './mocked-data/batch.mock';

const HARVESTING_PROCESS: Process = {
  id: 'ctest501',
  name: 'Harvesting',
};

describe('BatchService', () => {
  let service: BatchService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchService,
        {
          provide: PrismaService,
          useValue: {
            process: {
              findUnique: jest.fn(),
            },
            batch: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BatchService>(BatchService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create one harvest batch', async () => {
    const givenBatchCreateDtos: BatchCreateDto[] = [
      {
        idEUInfoSystem: null,
        in: [],
        weight: 33,
        recipient: 'ctest102',
        processStep: {
          location: '',
          date: '2024-05-24T08:28:24Z',
          process: null,
          recordedBy: 'ctest102',
          executedBy: 'ctest101',
          harvestedLand: 'ctest401',
        },
      },
    ];

    jest.spyOn(prisma.process, 'findUnique').mockResolvedValue(HARVESTING_PROCESS);
    jest.spyOn(prisma.batch, 'create').mockImplementation();
    await service.createHarvests(givenBatchCreateDtos);

    expect(prisma.batch.create).toHaveBeenCalledTimes(givenBatchCreateDtos.length);

    jest.spyOn(prisma.batch, 'create').mockRejectedValue(new Error('Error'));
    await expect(service.createHarvests(givenBatchCreateDtos)).rejects.toThrow();
  });

  it('should read coffee batches by company ID', async () => {
    const companyId = 'testCompanyId';
    const mockBatches = [mockedPrismaBatchWithRelations1, mockedPrismaBatchWithRelations2];

    jest.spyOn(prisma.batch, 'findMany').mockResolvedValue(mockBatches);

    const result = await service.readBatchesByCompanyId(companyId);

    expect(result).toHaveLength(mockBatches.length);
    expect(result[0].id).toBe(mockBatches[0].id);
    expect(result[0].weight).toBe(mockBatches[0].weight);
    expect(result[0].recipient).toStrictEqual(mockBatches[0].recipient.user);
    expect(result[0].processStep.location).toBe(mockBatches[0].processStep.location);
    expect(result[0].processStep.date).toBe(mockBatches[0].processStep.date);
    expect(result[0].processStep.recordedBy).toBe(mockBatches[0].processStep.recordedBy.user);
    expect(result[0].processStep.executedBy).toBe(mockBatches[0].processStep.executedBy.user);
    expect(result[0].processStep.farmedLand).toBe(mockBatches[0].processStep.farmedLand);
    expect(result[1].id).toBe(mockBatches[1].id);
    expect(result[1].weight).toBe(mockBatches[1].weight);
    expect(result[1].recipient).toStrictEqual(mockBatches[1].recipient.company);
    expect(result[1].processStep.location).toBe(mockBatches[1].processStep.location);
    expect(result[1].processStep.date).toBe(mockBatches[1].processStep.date);
    expect(result[1].processStep.recordedBy).toBe(mockBatches[1].processStep.recordedBy.company);
    expect(result[1].processStep.executedBy).toBe(mockBatches[1].processStep.executedBy.company);
    expect(result[1].processStep.farmedLand).toBe(mockBatches[1].processStep.farmedLand);
  });
});
