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

import { BatchMessagePatterns, CompanyMessagePatterns } from '@forest-guard/amqp';
import {
  BatchCombinedCreateDto,
  BatchCreateDto,
  BatchDto,
  BatchExportWrapperDto,
  ProcessDisplayDto,
  ProcessStepIdResponse,
} from '@forest-guard/api-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BatchCreateService } from './create/batch-create.service';
import { BatchExportService } from './export/batch-export.service';
import { BatchReadService } from './read/batch-read.service';
import { BatchReadRelatedService } from './related/batch-read-related.service';

@Controller()
export class BatchController {
  constructor(
    private readonly batchCreateService: BatchCreateService,
    private readonly batchReadService: BatchReadService,
    private readonly batchReadRelatedService: BatchReadRelatedService,
    private readonly batchExportService: BatchExportService
  ) {}

  @MessagePattern(BatchMessagePatterns.CREATE_HARVESTS)
  async createHarvests(@Payload() batchCreateDtos: BatchCreateDto[]): Promise<ProcessStepIdResponse> {
    return this.batchCreateService.createHarvests(batchCreateDtos);
  }

  @MessagePattern(BatchMessagePatterns.CREATE_COMBINED_HARVESTS)
  async createCombinedHarvests(@Payload() batchCombinedCreateDto: BatchCombinedCreateDto): Promise<ProcessStepIdResponse> {
    return this.batchCreateService.createCombinedHarvests(batchCombinedCreateDto);
  }

  @MessagePattern(BatchMessagePatterns.CREATE)
  async createBatches(@Payload() batchCreateDtos: BatchCreateDto[]): Promise<ProcessStepIdResponse> {
    return this.batchCreateService.createBatches(batchCreateDtos);
  }

  @MessagePattern(BatchMessagePatterns.READ_BY_ID)
  async readBatchById(@Payload() payload: { id: string }): Promise<BatchDto> {
    return this.batchReadService.readBatchById(payload.id);
  }

  @MessagePattern(CompanyMessagePatterns.READ_BATCHES)
  async readBatchesByCompanyId(@Payload() payload: { companyId: string; query: string; sorting: string }): Promise<BatchDto[]> {
    return this.batchReadService.readBatchesByCompanyId(payload.companyId, payload.query, payload.sorting);
  }

  @MessagePattern(BatchMessagePatterns.READ_BY_ID_RELATED)
  async readRelatedBatchesById(@Payload() payload: { id: string }): Promise<ProcessDisplayDto> {
    return this.batchReadRelatedService.readRelatedBatchesById(payload.id);
  }

  @MessagePattern(BatchMessagePatterns.READ_EXPORT)
  async readExportBatch(@Payload() payload: { id: string }): Promise<BatchExportWrapperDto> {
    return this.batchExportService.exportBatch(payload.id);
  }
}
