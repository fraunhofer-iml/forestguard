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

import { BatchCombinedCreateDto, BatchCreateDto } from '@forest-guard/api-interfaces';
import { getBatchesFromDb } from '../../test-utils/batches.spec.utils';
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
