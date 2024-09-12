import { BatchCombinedCreateDto, BatchCreateDto } from '@forest-guard/api-interfaces';
import { getBatchesFromDb, Process } from './batches.spec.utils';
import { HttpStatus } from '@nestjs/common';

export const batchNotFoundMessage = `No Batch found`;

export function ensureBatch(responseBatch, givenBatchCreateDto: BatchCreateDto) {
  ensureBatchWithProcess(responseBatch, givenBatchCreateDto, <Process>givenBatchCreateDto.processStep.process);
}

export function ensureBatchWithProcess(responseBatch, givenBatchCreateDto: BatchCreateDto | BatchCombinedCreateDto, processName: Process) {
  expect(responseBatch.weight).toEqual(givenBatchCreateDto.weight);
  expect(responseBatch.recipient.id).toEqual(givenBatchCreateDto.recipient);
  expect(responseBatch.processStep.executedBy.id).toEqual(givenBatchCreateDto.processStep.executedBy);
  expect(responseBatch.processStep.process.name).toEqual(processName);
}

export async function ensureResponseBatch(response, batchCreateDto: BatchCreateDto, numberOfExpectedActiveBatches: number) {
  await ensureResponseBatchWithProcess(response, batchCreateDto, numberOfExpectedActiveBatches, <Process>batchCreateDto.processStep.process);
}

export async function ensureResponseBatchWithProcess(response, batchCreateDto: BatchCreateDto, numberOfExpectedActiveBatches: number, processName: Process) {
  expect(response.status).toBe(HttpStatus.CREATED);
  const batches = await getBatchesFromDb(batchCreateDto.recipient);
  expect(batches.length).toBe(numberOfExpectedActiveBatches);
  for (const batch of batches) {
    ensureBatchWithProcess(batch, batchCreateDto, processName);
  }
}

export function ensureException(err, message: string) {
  expect(err.response.data.status).toBe(400);
  expect(err.response.data.timestamp).toBeDefined();
  expect(err.response.data.message).toBe(message);
  expect(err.response.data.requestDetails).toBeDefined();
}
