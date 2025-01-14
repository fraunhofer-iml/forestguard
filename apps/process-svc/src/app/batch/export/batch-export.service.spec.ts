/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrismaService } from '@forest-guard/database';
import { Test, TestingModule } from '@nestjs/testing';
import { mockedExportBatchDto } from '../mocked-data/batch.mock';
import { readBatchIncludeQuery } from '../utils/batch.queries';
import { BatchExportService } from './batch-export.service';

describe('BatchExportService', () => {
  let service: BatchExportService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchExportService,
        {
          provide: PrismaService,
          useValue: {
            batch: {
              findUniqueOrThrow: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BatchExportService>(BatchExportService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should read export data', async () => {
    const testBatchId = 'testBatchId';

    jest.spyOn(prisma.batch, 'findUniqueOrThrow').mockResolvedValue(mockedExportBatchDto);
    jest
      .spyOn(prisma.batch, 'findMany')
      .mockResolvedValue([])
      .mockResolvedValueOnce([mockedExportBatchDto.ins[0]])
      .mockResolvedValueOnce([mockedExportBatchDto.ins[0].ins[0]]);

    const result = await service.exportBatch(testBatchId);

    expect(result.rootBatch.ins[0].ins[0].id).toBe(mockedExportBatchDto.ins[0].ins[0].id);
    expect(prisma.batch.findUniqueOrThrow).toHaveBeenCalledWith({
      where: {
        id: testBatchId,
      },
      include: readBatchIncludeQuery(),
    });
    expect(prisma.batch.findMany).toHaveBeenCalledWith({
      where: {
        id: { in: [mockedExportBatchDto.ins[0].id] },
      },
      include: readBatchIncludeQuery(),
    });
    expect(prisma.batch.findMany).toHaveBeenCalledWith({
      where: {
        id: { in: [mockedExportBatchDto.ins[0].ins[0].id] },
      },
      include: readBatchIncludeQuery(),
    });
  });
});
