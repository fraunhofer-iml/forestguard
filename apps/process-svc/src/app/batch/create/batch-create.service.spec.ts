import { BlockchainConnectorModule, BlockchainConnectorService } from '@forest-guard/blockchain-connector';
import { PrismaService } from '@forest-guard/database';
import { Test, TestingModule } from '@nestjs/testing';
import { mockedCombinedBatchDto, mockedCreateBatchDto, mockedPrismaBatch1, mockedPrismaBatchWithRelations1, mockedPrismaBatchWithRelations4 } from '../mocked-data/batch.mock';
import { BatchCreateService } from './batch-create.service';
import { AmqpException } from '@forest-guard/amqp';


describe('BatchService', () => {
  let service: BatchCreateService;
  let prisma: PrismaService;
  let blockchainConnectorService: BlockchainConnectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BlockchainConnectorModule],
      providers: [
        BatchCreateService,
        {
          provide: PrismaService,
          useValue: {
            batch: {
              create: jest.fn(),
              updateMany: jest.fn(),
              findUnique: jest.fn(),
            },
            processStep: {
              create: jest.fn(),
            },
            plotOfLand: {
              count: jest.fn(),
            },
          },
        },
        {
          provide: BlockchainConnectorService,
          useValue: {
            mintBatchRootNft: jest.fn(),
            mintBatchLeafNft: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BatchCreateService>(BatchCreateService);
    prisma = module.get<PrismaService>(PrismaService);
    blockchainConnectorService = module.get<BlockchainConnectorService>(BlockchainConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(blockchainConnectorService).toBeDefined();
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
    jest.spyOn(prisma.batch, 'findUnique').mockResolvedValue(mockedPrismaBatchWithRelations1);
    jest.spyOn(prisma.batch, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1);

    await service.createHarvests(createBatchDtos);
    expect(prisma.batch.create).toHaveBeenCalledTimes(createBatchDtos.length + 1);
  });

  it('should create multiple harvest batches to multiple plot of lands', async () => {
    const combinedBatchDto = mockedCombinedBatchDto;
    jest.spyOn(prisma.batch, 'findUnique').mockResolvedValue(mockedPrismaBatchWithRelations1);
    jest.spyOn(prisma.batch, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1);
    jest.spyOn(prisma.plotOfLand, 'count').mockResolvedValue(mockedCombinedBatchDto.processStep.harvestedLands.length);

    await service.createCombinedHarvests(combinedBatchDto);
    expect(prisma.batch.create).toHaveBeenCalledTimes(combinedBatchDto.processStep.harvestedLands.length + 1);
  });

  it('should create one batch and connect it to an existing one', async () => {
    const mockedCreateBatchDtosWithLinks = [mockedCreateBatchDto].slice();
    const links = ['l1', 'l2', 'l3'];
    mockedCreateBatchDtosWithLinks[0].ins = links;

    jest.spyOn(prisma.batch, 'findUnique').mockResolvedValue(mockedPrismaBatchWithRelations1);
    jest.spyOn(prisma.batch, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1);
    jest.spyOn(prisma.batch, 'updateMany').mockImplementation();
    jest.spyOn(prisma.processStep, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1.processStep);
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

  // TODO: test new logic
  // für jede exception einen
  // für 2. nochmal mit dem 1. element active und dem 2. inactve


  // 1. 

  it('should throw an error for not finding a Batch', async () => {
    const mockedCreateBatchDtos = [mockedCreateBatchDto];
    // findUnique should fail

    jest.spyOn(prisma.processStep, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1.processStep);

    jest.spyOn(prisma.batch, 'findUnique').mockResolvedValue(undefined);
    jest.spyOn(prisma.batch, 'create').mockImplementation();


    await expect(service.createBatches(mockedCreateBatchDtos)).rejects.toThrow(AmqpException);
    // implement siehe screenshot 
  });

  // 2.1 
  it('should throw an error for an inactive batch', async () => {
    // mockedPrismaBatchWithRelations4.active = false
    const mockedCreateBatchDtos = [mockedCreateBatchDto];

    jest.spyOn(prisma.processStep, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1.processStep);
    jest.spyOn(prisma.batch, 'findUnique').mockResolvedValue(mockedPrismaBatchWithRelations4);
    jest.spyOn(prisma.batch, 'create').mockImplementation();
    

    await expect(service.createBatches(mockedCreateBatchDtos)).rejects.toThrow(AmqpException);
    // implement siehe screenshot 
  });

  // 2.2
  // prüfen ob findUnique 2 mal aufgerufen wird 
  
  it('should throw an error for just one inactive batch', async () => {
    const mockedCreateBatchDtos = [mockedCreateBatchDto, mockedCreateBatchDto];
    jest.spyOn(prisma.processStep, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1.processStep);

    jest.spyOn(prisma.batch, 'findUnique')
    .mockResolvedValueOnce(mockedPrismaBatchWithRelations1)
    .mockResolvedValueOnce(mockedPrismaBatchWithRelations4);
    jest.spyOn(prisma.batch, 'create').mockResolvedValue(mockedPrismaBatch1);
    expect(prisma.batch.findUnique).toHaveBeenCalledTimes(2);
    await expect(service.createBatches(mockedCreateBatchDtos)).rejects.toThrow(AmqpException);
    // implement siehe Screenshot
  });
  
});
