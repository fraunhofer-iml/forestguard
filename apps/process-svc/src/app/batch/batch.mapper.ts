import { BatchDto } from '@forrest-guard/api-interfaces';
import { BatchWithRelations } from './batch.types';

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
