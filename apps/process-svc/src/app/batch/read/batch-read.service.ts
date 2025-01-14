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

import { BatchDto } from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import { Injectable } from '@nestjs/common';
import { mapBatchPrismaToBatchDto } from '../utils/batch.mapper';
import { readBatchByIdQuery, readCoffeeBatchesByCompanyIdQuery } from '../utils/batch.queries';

@Injectable()
export class BatchReadService {
  constructor(private readonly prismaService: PrismaService) {}

  async readBatchById(id: string): Promise<BatchDto> {
    const batch = await this.prismaService.batch.findUniqueOrThrow(readBatchByIdQuery(id));
    return mapBatchPrismaToBatchDto(batch);
  }

  async readBatchesByCompanyId(companyId: string, query: string, sorting: string): Promise<BatchDto[]> {
    const batches = await this.prismaService.batch.findMany(readCoffeeBatchesByCompanyIdQuery(companyId, query, sorting));
    const batchDtos = batches.map(mapBatchPrismaToBatchDto);
    for (const batch of batchDtos) {
      batch.hasAllProofs = await this.getStatusOfBatch(batch.id);
    }
    return batchDtos;
  }

  async getStatusOfBatch(batchId: string): Promise<boolean> {
    const batch = await this.prismaService.batch.findUniqueOrThrow(readBatchByIdQuery(batchId));
    const farmedLand = batch.processStep.farmedLand;

    if (farmedLand) {
      return batch.processStep.farmedLand.proofs?.length === 2;
    }

    if (!farmedLand && batch.ins.length > 0) {
      for (const inStep of batch.ins) {
        if (!(await this.getStatusOfBatch(inStep.id))) {
          return false;
        }
      }
      return true;
    }

    return false;
  }
}
