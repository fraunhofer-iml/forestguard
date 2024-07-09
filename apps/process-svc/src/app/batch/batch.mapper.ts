import {
  BatchCombinedCreateDto,
  BatchCreateDto,
  BatchDto,
  Edge,
  ProcessDisplayDto,
} from '@forrest-guard/api-interfaces';
import { BatchWithRelations } from './batch.types';
import { Batch, BatchRelation } from '@prisma/client';

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

export const mapToProcessDisplayDto = (batchRelations: BatchRelation[], batches: Batch[]): ProcessDisplayDto => {
  return {
    coffeeBatches: batches.map(mapBatchPrismaToBatchDto),
    edges: batchRelations.map(mapBatchRelationToEdge),
  };
};

export const mapBatchRelationToEdge = (batchRelation: BatchRelation): Edge => {
  const { inId, outId } = batchRelation;
  return {
    from: inId,
    to: outId,
  };
};

export const mapBatchCombinedToBatchCreateDto = (batchCombinedCreateDto: BatchCombinedCreateDto): BatchCreateDto => {
  return {
    ...batchCombinedCreateDto,
    in: [],
    processStep: {
      ...batchCombinedCreateDto.processStep,
      process: undefined,
    },
  };
};
