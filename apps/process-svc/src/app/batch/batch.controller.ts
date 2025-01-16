/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
