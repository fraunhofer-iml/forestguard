import { PrismaService } from '@forrest-guard/database';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  mockedCombinedBatchDto,
  mockedCreateBatchDto,
  mockedPrismaBatchRelations,
  mockedPrismaBatchWithRelations1,
  mockedPrismaBatchWithRelations2,
} from './mocked-data/batch.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { BatchService } from './batch.service';
import { BatchDto } from '@forrest-guard/api-interfaces';
import { BatchWithRelations } from './batch.types';
import { mapBatchRelationToEdge } from './batch.mapper';

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
            batch: {
              create: jest.fn(),
              updateMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              findMany: jest.fn(),
            },
            $queryRaw: jest.fn(),
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
    const createBatchDtos = [mockedCreateBatchDto];
    jest.spyOn(prisma.batch, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1);

    await service.createHarvests(createBatchDtos);
    expect(prisma.batch.create).toHaveBeenCalledTimes(createBatchDtos.length);

    jest.spyOn(prisma.batch, 'create').mockRejectedValue(new Error('Error'));
    await expect(service.createHarvests(createBatchDtos)).rejects.toThrow();
  });

  it('should create multiple harvest batches', async () => {
    const createBatchDtos = [mockedCreateBatchDto, mockedCreateBatchDto];
    jest.spyOn(prisma.batch, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1);

    await service.createHarvests(createBatchDtos);
    expect(prisma.batch.create).toHaveBeenCalledTimes(createBatchDtos.length + 1);
  });

  it('should create multiple harvest batches to multiple plot of lands', async () => {
    const combinedBatchDto = mockedCombinedBatchDto;
    jest.spyOn(prisma.batch, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1);

    await service.createCombinedHarvests(combinedBatchDto);
    expect(prisma.batch.create).toHaveBeenCalledTimes(combinedBatchDto.processStep.harvestedLands.length + 1);
  });

  it('should create one batch and connect it to an existing one', async () => {
    const mockedCreateBatchDtosWithLinks = [mockedCreateBatchDto].slice();
    const links = ['l1', 'l2', 'l3'];
    mockedCreateBatchDtosWithLinks[0].in = links;

    jest.spyOn(prisma.batch, 'create').mockImplementation();
    jest.spyOn(prisma.batch, 'updateMany').mockImplementation();
    await service.createBatches(mockedCreateBatchDtosWithLinks);

    expect(prisma.batch.create).toHaveBeenCalledTimes(mockedCreateBatchDtosWithLinks.length);
    expect(prisma.batch.updateMany).toHaveBeenCalledWith({
      where: {
        id: { in: links },
      },
      data: {
        active: false,
      },
    });

    jest.spyOn(prisma.batch, 'create').mockRejectedValue(new Error('Error'));
    await expect(service.createHarvests(mockedCreateBatchDtosWithLinks)).rejects.toThrow();
  });

  it('should return a valid BatchDto', async () => {
    const givenBatchId = mockedPrismaBatchWithRelations1.id;

    jest.spyOn(prisma.batch, 'findUniqueOrThrow').mockResolvedValue(mockedPrismaBatchWithRelations1);
    const actualBatchDto = await service.readBatchById(givenBatchId);

    expectResultToBeBatchDto(actualBatchDto, mockedPrismaBatchWithRelations1);
    expectResultEntitiesToBeDtoUsers(actualBatchDto, mockedPrismaBatchWithRelations1);
  });

  it('should throw a NotFoundException', async () => {
    const givenBatchId = '123';
    const expectedException = new PrismaClientKnownRequestError('', { code: 'P2025', clientVersion: '' });

    jest.spyOn(prisma.batch, 'findUniqueOrThrow').mockImplementation(() => {
      throw expectedException;
    });

    await expect(service.readBatchById(givenBatchId)).rejects.toThrow(expectedException);
  });

  it('should read coffee batches by company ID', async () => {
    const companyId = 'testCompanyId';
    const mockBatches = [mockedPrismaBatchWithRelations1, mockedPrismaBatchWithRelations2];

    jest.spyOn(prisma.batch, 'findMany').mockResolvedValue(mockBatches);

    const result = await service.readBatchesByCompanyId(companyId);
    expect(result).toHaveLength(mockBatches.length);
    expectResultToBeBatchDto(result[0], mockBatches[0]);
    expectResultEntitiesToBeDtoUsers(result[0], mockBatches[0]);
    expectResultToBeBatchDto(result[1], mockBatches[1]);
    expectResultEntitiesToBeDtoCompanies(result[1], mockBatches[1]);
  });

  it('should read all related batches by batch ID', async () => {
    const testBatchId = 'testBatchId';
    const mockBatches = [mockedPrismaBatchWithRelations1, mockedPrismaBatchWithRelations2];

    jest.spyOn(prisma, '$queryRaw').mockResolvedValue([]).mockResolvedValueOnce(mockedPrismaBatchRelations);
    jest.spyOn(prisma.batch, 'findMany').mockResolvedValue(mockBatches);

    const result = await service.readRelatedBatchesById(testBatchId);

    expect(result.edges).toStrictEqual(mockedPrismaBatchRelations.map(mapBatchRelationToEdge));
  });
});

function expectResultToBeBatchDto(result: BatchDto, mockBatch: BatchWithRelations) {
  expect(result.id).toBe(mockBatch.id);
  expect(result.weight).toBe(mockBatch.weight);
  expect(result.processStep.location).toBe(mockBatch.processStep.location);
  expect(result.processStep.date).toBe(mockBatch.processStep.date);
  expect(result.processStep.farmedLand).toBe(mockBatch.processStep.farmedLand);
}

function expectResultEntitiesToBeDtoUsers(result: BatchDto, mockBatch: BatchWithRelations) {
  expect(result.recipient).toStrictEqual(mockBatch.recipient.user);
  expect(result.processStep.recordedBy).toBe(mockBatch.processStep.recordedBy.user);
  expect(result.processStep.executedBy).toBe(mockBatch.processStep.executedBy.user);
}

function expectResultEntitiesToBeDtoCompanies(result: BatchDto, mockBatch: BatchWithRelations) {
  expect(result.recipient).toStrictEqual(mockBatch.recipient.company);
  expect(result.processStep.recordedBy).toBe(mockBatch.processStep.recordedBy.company);
  expect(result.processStep.executedBy).toBe(mockBatch.processStep.executedBy.company);
}
