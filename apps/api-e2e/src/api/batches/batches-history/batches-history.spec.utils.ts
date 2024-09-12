import { BatchCreateDto } from '@forest-guard/api-interfaces';
import axios from 'axios';
import { createHttpHeader, prisma } from '../../test.utils';
import { marker1, marker2, marker3 } from '../batches.spec.utils';

export async function prepareTree(batchCreateDto: BatchCreateDto) {
  await saveAndMergeHarvests(batchCreateDto);

  const mergedBatches = await getActiveBatches();
  await splitIntoTwoBatches(batchCreateDto, [mergedBatches[0]], marker2);

  const firstSplitBatches = await getActiveBatches();
  await splitIntoTwoBatches(batchCreateDto, [firstSplitBatches[0]], marker3);

  return {
    targetBatch: firstSplitBatches[0],
    deadEndBatch: firstSplitBatches[1],
  };
}

async function saveAndMergeHarvests(batchCreateDto: BatchCreateDto) {
  batchCreateDto.processStep.location = marker1;
  await axios.post(`/batches/harvests`, [batchCreateDto, batchCreateDto], await createHttpHeader());
}

async function getActiveBatches() {
  return (await prisma.batch.findMany())
    .filter(batch => batch.active === true);
}

async function splitIntoTwoBatches(batchCreateDto: BatchCreateDto, predecessorBatches, marker: string) {
  batchCreateDto.ins.push(...predecessorBatches.map(batch => batch.id));
  batchCreateDto.processStep.location = marker;
  await axios.post(`/batches`, [batchCreateDto, batchCreateDto], await createHttpHeader());
}
