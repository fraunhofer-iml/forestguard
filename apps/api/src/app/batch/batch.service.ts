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

import { AmqpClientEnum, BatchMessagePatterns } from '@forest-guard/amqp';
import {
  BatchCombinedCreateDto,
  BatchCreateDto,
  BatchDto,
  BatchExportWrapperDto,
  ProcessDisplayDto,
  ProcessStepIdResponse,
} from '@forest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CompanyService } from '../company/company.service';

@Injectable()
export class BatchService {
  constructor(@Inject(AmqpClientEnum.QUEUE_PROCESS) private readonly processService: ClientProxy, private companyService: CompanyService) {}

  async createHarvests({ batchCreateDtos, companyId }: { batchCreateDtos: BatchCreateDto[]; companyId: string }): Promise<ProcessStepIdResponse> {
    await this.checkRecordedBy(companyId, batchCreateDtos);

    return firstValueFrom(this.processService.send(BatchMessagePatterns.CREATE_HARVESTS, batchCreateDtos));
  }

  async createCombinedHarvests({
    batchCombinedCreateDto,
    companyId,
  }: {
    batchCombinedCreateDto: BatchCombinedCreateDto;
    companyId: string;
  }): Promise<ProcessStepIdResponse> {
    const company = await this.companyService.readCompany(companyId);

    if (!company) {
      throw new UnauthorizedException();
    }

    if (![...company.employees, ...company.farmers].find((c) => c.id === batchCombinedCreateDto.processStep.recordedBy)) {
      throw new BadRequestException('Recorded by is not part of the company');
    }

    return firstValueFrom(this.processService.send(BatchMessagePatterns.CREATE_COMBINED_HARVESTS, batchCombinedCreateDto));
  }

  async createBatches({ batchCreateDtos, companyId }: { batchCreateDtos: BatchCreateDto[]; companyId: string }): Promise<ProcessStepIdResponse> {
    await this.checkRecordedBy(companyId, batchCreateDtos);

    return firstValueFrom(this.processService.send(BatchMessagePatterns.CREATE, batchCreateDtos));
  }

  readBatch(id: string): Promise<BatchDto> {
    return firstValueFrom(this.processService.send(BatchMessagePatterns.READ_BY_ID, { id }));
  }

  async getRelatedBatches(id: string): Promise<ProcessDisplayDto> {
    return await firstValueFrom<ProcessDisplayDto>(
      this.processService.send(BatchMessagePatterns.READ_BY_ID_RELATED, { id })
    );
  }

  readExportBatch(id: string): Promise<BatchExportWrapperDto> {
    return firstValueFrom(this.processService.send(BatchMessagePatterns.READ_EXPORT, { id }));
  }

  private async checkRecordedBy(companyId: string, batchCreateDtos: BatchCreateDto[]): Promise<void> {
    const company = await this.companyService.readCompany(companyId);

    if (!company) {
      throw new UnauthorizedException();
    }

    if (!batchCreateDtos.every((batch) => company.employees.find((c) => c.id === batch.processStep.recordedBy))) {
      throw new BadRequestException('Recorded by is not an employee of the company');
    }
  }
}
