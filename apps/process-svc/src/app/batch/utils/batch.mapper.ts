import { BatchCombinedCreateDto, BatchCreateDto, BatchDto, BatchExportDto, Edge } from '@forest-guard/api-interfaces';
import { BatchWithRelations } from '../types/batch.types';

export const mapBatchPrismaToBatchDto = (batch: BatchWithRelations): BatchDto => {
  return {
    ...batch,
    processStep: {
      ...batch.processStep,
      recordedBy: batch.processStep.recordedBy.user ?? batch.processStep.recordedBy.company,
      executedBy: batch.processStep.executedBy.user ?? batch.processStep.executedBy.company,
      documents: batch.processStep.documents
    },
    recipient: {
      ...(batch.recipient.user ?? batch.recipient.company),
    },
  };
};

export const mapBatchPrismaToBatchExportDto = (batch: BatchWithRelations): BatchExportDto => {
  return {
    ...mapBatchPrismaToBatchDto(batch),
    ins: [],
    outs: [],
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
    ins: [],
    processStep: {
      ...batchCombinedCreateDto.processStep,
      process: undefined,
    },
  };
};
