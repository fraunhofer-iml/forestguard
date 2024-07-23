import {
  BatchCombinedCreateDto,
  BatchCreateDto,
  BatchDto, BatchExportDto,
  Edge,
  ProcessDisplayDto,
} from '@forrest-guard/api-interfaces';
import { BatchWithRelations } from '../types/batch.types';
import { Batch } from '@prisma/client';

export const mapBatchPrismaToBatchDto = (batch: BatchWithRelations): BatchDto => {
  return {
    ...batch,
    processStep: {
      ...batch.processStep,
      recordedBy: batch.processStep.recordedBy.user ?? batch.processStep.recordedBy.company,
      executedBy: batch.processStep.executedBy.user ?? batch.processStep.executedBy.company,
    },
    recipient: {
      ...(batch.recipient.user ?? batch.recipient.company),
    },
  };
};

export const mapBatchPrismaToBatchExportDto = (batch: BatchWithRelations): BatchExportDto => {
  return {
    ...mapBatchPrismaToBatchDto(batch),
    ins : [],
    outs: []
  };
};

export const mapToProcessDisplayDto = (batchRelations: Edge[], batches: Batch[]): ProcessDisplayDto => {
  return {
    coffeeBatches: batches.map(mapBatchPrismaToBatchDto),
    edges: batchRelations,
  };
};

export const mapBatchRelationToEdge = ({A, B}): Edge => {
  return {
    from: B,
    to: A,
  };
};

export const mapBatchCombinedToBatchCreateDto = (batchCombinedCreateDto: BatchCombinedCreateDto): BatchCreateDto => {
  return {
    ...batchCombinedCreateDto,
    ins: [],
    processStep: {
      ...batchCombinedCreateDto.processStep,
      process: undefined,
    },
  };
};
