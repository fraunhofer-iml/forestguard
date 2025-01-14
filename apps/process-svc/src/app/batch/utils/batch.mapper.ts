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
