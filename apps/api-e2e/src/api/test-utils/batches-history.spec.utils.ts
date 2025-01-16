/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
  batchCreateDto.ins = [];
  batchCreateDto.ins.push(...predecessorBatches.map((batch) => batch.id));
  batchCreateDto.processStep.location = marker;
  await axios.post(`/batches`, [batchCreateDto, batchCreateDto], httpHeader);
}
