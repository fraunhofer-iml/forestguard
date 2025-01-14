/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

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
