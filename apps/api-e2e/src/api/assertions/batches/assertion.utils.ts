import { BatchCombinedCreateDto, BatchCreateDto } from '@forest-guard/api-interfaces';
import { getBatchesFromDb } from '../../test-utils/batches/batches.spec.utils';
import { HttpStatus } from '@nestjs/common';
import { Process } from '../../test-utils/arrange-utils';

export const batchNotFoundMessage = `No Batch found`;

export function ensureBatch(actualBatch, expectedBatchCreateDto: BatchCreateDto) {
  ensureBatchWithProcess(actualBatch, expectedBatchCreateDto, <Process>expectedBatchCreateDto.processStep.process);
}

export function ensureBatchWithProcess(actualBatch, expectedBatchCreateDto: BatchCreateDto | BatchCombinedCreateDto, expectedProcessName: Process) {
  expect(actualBatch.weight).toEqual(expectedBatchCreateDto.weight);
  expect(actualBatch.recipient.id).toEqual(expectedBatchCreateDto.recipient);
  expect(actualBatch.processStep.executedBy.id).toEqual(expectedBatchCreateDto.processStep.executedBy);
  expect(actualBatch.processStep.process.name).toEqual(expectedProcessName);
}

export async function ensureResponseBatch(response, batchCreateDto: BatchCreateDto, numberOfExpectedActiveBatches: number) {
  await ensureResponseBatchWithProcess(response, batchCreateDto, numberOfExpectedActiveBatches, <Process>batchCreateDto.processStep.process);
}

export async function ensureResponseBatchWithProcess(response, expectedBatchCreateDto: BatchCreateDto, expectedNumberOfActiveBatches: number, expectedProcessName: Process) {
  expect(response.status).toBe(HttpStatus.CREATED);
  const batches = await getBatchesFromDb(expectedBatchCreateDto.recipient);
  expect(batches.length).toBe(expectedNumberOfActiveBatches);
  for (const batch of batches) {
    ensureBatchWithProcess(batch, expectedBatchCreateDto, expectedProcessName);
  }
}
