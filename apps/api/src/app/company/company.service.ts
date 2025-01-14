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

import { AmqpClientEnum, CompanyMessagePatterns, UserMessagePatterns } from '@forest-guard/amqp';
import { BatchDto, CompanyCreateDto, CompanyDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy,
    @Inject(AmqpClientEnum.QUEUE_PROCESS) private processService: ClientProxy
  ) {}

  createCompany(dto: CompanyCreateDto, user): Promise<CompanyDto> {
    const keycloakCompanyId: string = user.sub;
    return firstValueFrom(this.entityManagementService.send(CompanyMessagePatterns.CREATE, { dto, keycloakCompanyId }));
  }

  readCompany(id: string): Promise<CompanyDto> {
    return firstValueFrom(this.entityManagementService.send(CompanyMessagePatterns.READ_BY_ID, { id }));
  }

  /**
   * Reads all companies, filters and sorts them.
   *
   * @param filters - The property to set the filters.
   * @param sorting - The property to set the sorting.
   * @returns The list of companies that satisfy the given filters ordered by the given sorting.
   */
  readCompanies(filters: string, sorting: string): Promise<CompanyDto[]> {
    return firstValueFrom(
      this.entityManagementService.send(CompanyMessagePatterns.READ_COMPANIES, {
        filters,
        sorting,
      })
    );
  }

  /**
   * Reads the batches that belong to a company
   * @param companyId The id of the company
   * @param query The query to filter output
   * @param sorting The property to set the sorting
   * @returns The batches that belong to the company
   */
  async readBatchesByCompanyId(companyId: string, query: string, sorting: string): Promise<BatchDto[]> {
    return firstValueFrom(this.processService.send(CompanyMessagePatterns.READ_BATCHES, { companyId, query, sorting }));
  }

  readFarmersByCompanyId(companyId: string): Promise<UserOrFarmerDto[]> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.READ_FARMER_BY_COMPANY_ID, { companyId }));
  }
}
