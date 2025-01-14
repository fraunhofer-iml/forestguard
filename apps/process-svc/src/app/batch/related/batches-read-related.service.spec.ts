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
import { mockedPrismaBatch1, mockedPrismaBatch2, mockedPrismaBatch3, mockedPrismaBatch4 } from '../mocked-data/batch.mock';
import { BatchReadRelatedService } from './batch-read-related.service';

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

    jest
      .spyOn(prisma.batch, 'findUniqueOrThrow')
      .mockResolvedValueOnce(mockedPrismaBatch1)
      .mockResolvedValueOnce(mockedPrismaBatch2)
      .mockResolvedValueOnce(mockedPrismaBatch3)
      .mockResolvedValueOnce(mockedPrismaBatch4);

    const result = await service.readRelatedBatchesById(testBatchId);

    expect(result.edges).toEqual(resultEdges);
  });

  it('should read all related batches by batch ID and mark as invalid', async () => {
    const testBatchId = '1';
    const resultEdges = [
      { from: '1', to: '2', invalid: true },
      { from: '2', to: '3', invalid: true },
      { from: '2', to: '4', invalid: true },
    ];

    const mockedPrismaBatch1WithoutProofs = mockedPrismaBatch1;
    mockedPrismaBatch1WithoutProofs.processStep.farmedLand.proofs = [];

    jest
      .spyOn(prisma.batch, 'findUniqueOrThrow')
      .mockResolvedValueOnce(mockedPrismaBatch1WithoutProofs)
      .mockResolvedValueOnce(mockedPrismaBatch2)
      .mockResolvedValueOnce(mockedPrismaBatch3)
      .mockResolvedValueOnce(mockedPrismaBatch4);

    const result = await service.readRelatedBatchesById(testBatchId);

    expect(result.edges).toEqual(resultEdges);
  });
});
