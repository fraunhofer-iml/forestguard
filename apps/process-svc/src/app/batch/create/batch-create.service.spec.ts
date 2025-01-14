/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockchainConnectorModule, BlockchainConnectorService } from '@forest-guard/blockchain-connector';
import { PrismaService } from '@forest-guard/database';
import { Test, TestingModule } from '@nestjs/testing';
import { mockedCombinedBatchDto, mockedCreateBatchDto, mockedPrismaBatchWithRelations1 } from '../mocked-data/batch.mock';
import { BatchCreateService } from './batch-create.service';

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
    jest.spyOn(prisma.batch, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1);

    await service.createHarvests(createBatchDtos);
    expect(prisma.batch.create).toHaveBeenCalledTimes(createBatchDtos.length + 1);
  });

  it('should create multiple harvest batches to multiple plot of lands', async () => {
    const combinedBatchDto = mockedCombinedBatchDto;
    jest.spyOn(prisma.batch, 'create').mockResolvedValue(mockedPrismaBatchWithRelations1);
    jest.spyOn(prisma.plotOfLand, 'count').mockResolvedValue(mockedCombinedBatchDto.processStep.harvestedLands.length);

    await service.createCombinedHarvests(combinedBatchDto);
    expect(prisma.batch.create).toHaveBeenCalledTimes(combinedBatchDto.processStep.harvestedLands.length + 1);
  });

  it('should create one batch and connect it to an existing one', async () => {
    const mockedCreateBatchDtosWithLinks = [mockedCreateBatchDto].slice();
    const links = ['l1', 'l2', 'l3'];
    mockedCreateBatchDtosWithLinks[0].ins = links;

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
});
