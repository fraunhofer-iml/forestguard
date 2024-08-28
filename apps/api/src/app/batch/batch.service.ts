import { AmqpClientEnum, BatchMessagePatterns } from '@forest-guard/amqp';
import { BatchCombinedCreateDto, BatchCreateDto, BatchDto, BatchExportWrapperDto, ProcessDisplayDto } from '@forest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { BadRequestException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CompanyService } from '../company/company.service';

@Injectable()
export class BatchService {
  constructor(@Inject(AmqpClientEnum.QUEUE_PROCESS) private readonly processService: ClientProxy, private companyService: CompanyService) {}

  async createHarvests({ batchCreateDtos, companyId }: { batchCreateDtos: BatchCreateDto[]; companyId: string }): Promise<HttpStatus> {
    await this.checkRecordedBy(companyId, batchCreateDtos);

    return firstValueFrom(this.processService.send(BatchMessagePatterns.CREATE_HARVESTS, batchCreateDtos));
  }

  async createCombinedHarvests({
    batchCombinedCreateDto,
    companyId,
  }: {
    batchCombinedCreateDto: BatchCombinedCreateDto;
    companyId: string;
  }): Promise<HttpStatus> {
    const company = await this.companyService.readCompany(companyId);

    if (!company) {
      throw new UnauthorizedException();
    }

    if (!company.employees.find((c) => c.id === batchCombinedCreateDto.processStep.recordedBy)) {
      throw new BadRequestException('Recorded by is not an employee of the company');
    }

    return firstValueFrom(this.processService.send(BatchMessagePatterns.CREATE_COMBINED_HARVESTS, batchCombinedCreateDto));
  }

  async createBatches({ batchCreateDtos, companyId }: { batchCreateDtos: BatchCreateDto[]; companyId: string }): Promise<HttpStatus> {
    await this.checkRecordedBy(companyId, batchCreateDtos);

    return firstValueFrom(this.processService.send(BatchMessagePatterns.CREATE, batchCreateDtos));
  }

  readBatch(id: string): Promise<BatchDto> {
    return firstValueFrom(this.processService.send(BatchMessagePatterns.READ_BY_ID, { id }));
  }

  async getRelatedBatches(id: string): Promise<ProcessDisplayDto> {
    const relatedBatches = await firstValueFrom<ProcessDisplayDto>(
      this.processService.send(BatchMessagePatterns.READ_BY_ID_RELATED, { id })
    );

    return relatedBatches;
  }

  readExportBatch(id: string): Promise<BatchExportWrapperDto> {
    return firstValueFrom(this.processService.send(BatchMessagePatterns.READ_EXPORT, { id }));
  }

  private async checkRecordedBy(companyId: string, batchCreateDtos: BatchCreateDto[]): Promise<void> {
    const company = await this.companyService.readCompany(companyId);

    if (!company) {
      throw new UnauthorizedException();
    }

    if (batchCreateDtos.every((batch) => company.employees.find((c) => c.id === batch.processStep.recordedBy))) {
      throw new BadRequestException('Recorded by is not an employee of the company');
    }
  }
}
