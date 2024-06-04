import { Test, TestingModule } from '@nestjs/testing';
import { BatchService } from './batch.service';
import { PrismaService } from '@forrest-guard/database';
import { Process } from '@prisma/client';
import { BatchCreateDto } from '@forrest-guard/api-interfaces';

const HARVESTING_PROCESS: Process = {
  id: 'ctest501',
  name: 'Harvesting'
}

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
  });

});
