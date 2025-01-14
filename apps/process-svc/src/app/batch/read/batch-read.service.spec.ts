/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchDto } from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { mockedPrismaBatchWithRelations1, mockedPrismaBatchWithRelations2 } from '../mocked-data/batch.mock';
import { BatchWithRelations } from '../types/batch.types';
import { BatchReadService } from './batch-read.service';

describe('BatchReadService', () => {
  let service: BatchReadService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchReadService,
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

    service = module.get<BatchReadService>(BatchReadService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
    jest.spyOn(prisma.batch, 'findUniqueOrThrow').mockResolvedValue(mockBatches[0]);

    const result = await service.readBatchesByCompanyId(companyId, '{}', '{}');
    expect(result).toHaveLength(mockBatches.length);
    expectResultToBeBatchDto(result[0], mockBatches[0]);
    expectResultEntitiesToBeDtoUsers(result[0], mockBatches[0]);
    expectResultToBeBatchDto(result[1], mockBatches[1]);
    expectResultEntitiesToBeDtoCompanies(result[1], mockBatches[1]);
  });

  it('should throw exception with invalid query JSON', async () => {
    const expectedException = new Error('JSON5: invalid end of input at 1:2');

    await expect(service.readBatchesByCompanyId('testCompanyId', '{', '{}')).rejects.toThrow(expectedException);
  });

  it('should throw exception with invalid sorting JSON', async () => {
    const expectedException = new Error("JSON5: invalid character '}' at 1:1");

    await expect(service.readBatchesByCompanyId('testCompanyId', '{}', '}')).rejects.toThrow(expectedException);
  });
});

function expectResultToBeBatchDto(result: BatchDto, mockBatch: BatchWithRelations) {
  expect(result.id).toBe(mockBatch.id);
  expect(result.weight).toBe(mockBatch.weight);
  expect(result.processStep.location).toBe(mockBatch.processStep.location);
  expect(result.processStep.dateOfProcess).toBe(mockBatch.processStep.dateOfProcess);
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
