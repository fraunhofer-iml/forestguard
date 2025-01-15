/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchExportWrapperDto } from '@forest-guard/api-interfaces';
import { HttpStatus } from '@nestjs/common';
import { Process } from '../../test-utils/arrange-utils';
import { marker1, marker2, marker3 } from '../../test-utils/batches-history.spec.utils';

export function ensureRelatedBatches(response, targetBatch, deadEndBatch) {
  expect(response.status).toBe(HttpStatus.OK);
  const responseBatches = response.data.coffeeBatches;
  const responseEdges = response.data.edges;

  // Ensure that number of batches is correct and that target batch belongs to response
  expect(responseBatches.length).toBe(6);
  expect(responseBatches.find((batch) => batch.id === targetBatch.id).processStep.location).toBe(marker2);

  // Ensure that harvest merge is correct
  const harvestMergeEdges = responseEdges.filter((edge) => edge.to === targetBatch.id);
  expect(harvestMergeEdges.length).toBe(1);
  expect(responseBatches.find((batch) => batch.id === harvestMergeEdges[0].from).processStep.process.name).toBe(Process.MERGE);

  // Ensure that harvest batches are correct
  const harvestBatchEdges = responseEdges.filter((edge) => edge.to === harvestMergeEdges[0].from);
  expect(harvestBatchEdges.length).toBe(2);
  expect(responseBatches.find((batch) => batch.id === harvestBatchEdges[0].from).processStep.location).toBe(marker1);

  // Ensure that final batches are correct
  const finalBatchEdges = responseEdges.filter((edge) => edge.from === targetBatch.id);
  expect(finalBatchEdges.length).toBe(2);
  expect(responseBatches.find((batch) => batch.id === finalBatchEdges[0].to).processStep.location).toBe(marker3);

  // Ensure that dead end batch does not belong to tree
  expect(responseBatches.filter((batch) => batch.id === deadEndBatch.id).length).toBe(0);
}

export function ensureExport(response, targetBatch) {
  expect(response.status).toBe(HttpStatus.OK);
  const responseData: BatchExportWrapperDto = response.data;
  expect(responseData.requestDate).toBeTruthy();
  const batch = responseData.rootBatch;

  // Ensure that root batch is correct
  expect(batch.id).toBe(targetBatch.id);
  expect(batch.processStep.location).toBe(marker2);

  // Ensure that harvest merge is correct
  expect(batch.ins.length).toBe(1);
  expect(batch.ins[0].processStep.process.name).toBe(Process.MERGE);

  // Ensure that harvest batches are correct
  expect(batch.ins[0].ins.length).toBe(2);
  expect(batch.ins[0].ins[0].processStep.location).toBe(marker1);

  // Ensure that final batches are correct
  expect(batch.outs.length).toBe(2);
  expect(batch.outs[0].processStep.location).toBe(marker3);

  // Ensure that no other batches are present
  expect(batch.outs[0].ins.length).toBe(0);
  expect(batch.outs[0].outs.length).toBe(0);
  expect(batch.outs[1].ins.length).toBe(0);
  expect(batch.outs[1].outs.length).toBe(0);
  expect(batch.ins[0].outs.length).toBe(0);
  expect(batch.ins[0].ins[0].ins.length).toBe(0);
  expect(batch.ins[0].ins[0].outs.length).toBe(0);
  expect(batch.ins[0].ins[1].ins.length).toBe(0);
  expect(batch.ins[0].ins[1].outs.length).toBe(0);
}
