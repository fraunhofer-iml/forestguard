import { AmqpClientEnum, CompanyMessagePatterns } from '@forrest-guard/amqp';
import { BatchDto, CompanyCreateDto, CompanyDto } from '@forrest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy,
    @Inject(AmqpClientEnum.QUEUE_PROCESS) private processService: ClientProxy
  ) {}

  createCompany(dto: CompanyCreateDto): Promise<CompanyDto> {
    return firstValueFrom(this.entityManagementService.send(CompanyMessagePatterns.CREATE, { dto }));
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
    return firstValueFrom(this.entityManagementService.send(CompanyMessagePatterns.READ_COMPANIES, { filters, sorting }));
  }

  /**
   * Reads the batches that belong to a company
   * @param companyId The id of the company
   * @param query The query to filter output
   * @param sorting The property to set the sorting
   * @returns The batches that belong to the company
   */
  readBatchesByCompanyId(companyId: string, query: string, sorting: string): Promise<BatchDto[]> {
    return firstValueFrom(this.processService.send(CompanyMessagePatterns.READ_BATCHES, { companyId, query, sorting }));
  }
}
