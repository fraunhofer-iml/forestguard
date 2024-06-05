import { AmqpClientEnum, CompanyMessagePatterns } from '@forrest-guard/amqp';
import { BatchDto, CompanyDto } from '@forrest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy,
    @Inject(AmqpClientEnum.QUEUE_PROCESS) private processService: ClientProxy
  ) {}

  readCompany(id: string): Promise<CompanyDto> {
    return firstValueFrom(this.entityManagementService.send(CompanyMessagePatterns.READ_BY_ID, { id }));
  }

  /**
   * Reads the batches that belong to a company
   * @param companyId The id of the company
   * @returns The batches that belong to the company
   */
  readBatchesByCompanyId(companyId: string): Promise<BatchDto[]> {
    return firstValueFrom(this.processService.send(CompanyMessagePatterns.READ_BATCHES, companyId));
  }
}
