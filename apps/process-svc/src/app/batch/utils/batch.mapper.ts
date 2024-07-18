import { BatchCombinedCreateDto, BatchCreateDto, BatchDto, Edge, ProcessDisplayDto } from '@forrest-guard/api-interfaces';
import { Batch } from '@prisma/client';
import { BatchWithRelations } from '../types/batch.types';

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

export const mapToProcessDisplayDto = (batchRelations: Edge[], batches: Batch[]): ProcessDisplayDto => {
  return {
    coffeeBatches: batches.map(mapBatchPrismaToBatchDto),
    edges: batchRelations,
  };
};

export const mapBatchRelationToEdge = ({ A, B }): Edge => {
  return {
    from: B,
    to: A,
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
