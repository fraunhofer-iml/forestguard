/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
