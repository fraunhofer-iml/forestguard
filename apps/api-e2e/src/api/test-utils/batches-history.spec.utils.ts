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

import { BatchCreateDto } from '@forest-guard/api-interfaces';
import axios from 'axios';
import { HttpHeader, prisma } from './test.utils';

export const marker1 = 'marker1';
export const marker2 = 'marker2';
export const marker3 = 'marker3';

export async function prepareTree(batchCreateDto: BatchCreateDto, httpHeader: HttpHeader) {
  await saveAndMergeHarvests(batchCreateDto, httpHeader);

  const mergedBatches = await getActiveBatches();
  await splitIntoTwoBatches(batchCreateDto, [mergedBatches[0]], marker2, httpHeader);

  const firstSplitBatches = await getActiveBatches();
  await splitIntoTwoBatches(batchCreateDto, [firstSplitBatches[0]], marker3, httpHeader);

  return {
    targetBatch: firstSplitBatches[0],
    deadEndBatch: firstSplitBatches[1],
  };
}

async function saveAndMergeHarvests(batchCreateDto: BatchCreateDto, httpHeader: HttpHeader) {
  batchCreateDto.processStep.location = marker1;
  await axios.post(`/batches/harvests`, [batchCreateDto, batchCreateDto], httpHeader);
}

async function getActiveBatches() {
  return (await prisma.batch.findMany()).filter((batch) => batch.active === true);
}

async function splitIntoTwoBatches(batchCreateDto: BatchCreateDto, predecessorBatches, marker: string, httpHeader: HttpHeader) {
  batchCreateDto.ins.push(...predecessorBatches.map((batch) => batch.id));
  batchCreateDto.processStep.location = marker;
  await axios.post(`/batches`, [batchCreateDto, batchCreateDto], httpHeader);
}
