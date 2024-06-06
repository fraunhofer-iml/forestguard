import { BatchMessagePatterns, CompanyMessagePatterns } from '@forrest-guard/amqp';
import { BatchCreateDto, BatchDto } from '@forrest-guard/api-interfaces';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BatchService } from './batch.service';

@Controller()
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @MessagePattern(BatchMessagePatterns.CREATE_HARVESTS)
  async createHarvests(@Payload() batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    return this.batchService.createHarvests(batchCreateDtos);
  }

  @MessagePattern(BatchMessagePatterns.READ_BY_ID)
  async readBatchById(@Payload() payload: { id: string }): Promise<BatchDto> {
    return this.batchService.readBatchById(payload.id);
  }

  @MessagePattern(CompanyMessagePatterns.READ_BATCHES)
  async readBatchesByCompanyId(@Payload() companyId: string): Promise<BatchDto[]> {
    return this.batchService.readBatchesByCompanyId(companyId);
  }
}
