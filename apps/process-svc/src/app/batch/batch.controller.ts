import { BatchMessagePatterns, CompanyMessagePatterns } from '@forrest-guard/amqp';
import { BatchCombinedCreateDto, BatchCreateDto, BatchDto, ProcessDisplayDto } from '@forrest-guard/api-interfaces';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BatchService } from './batch.service';
import { RelatedBatchesService } from './related/related-batches.service';

@Controller()
export class BatchController {
  constructor(private readonly batchService: BatchService, private readonly relatedBatchService: RelatedBatchesService) {}

  @MessagePattern(BatchMessagePatterns.CREATE_HARVESTS)
  async createHarvests(@Payload() batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    return this.batchService.createHarvests(batchCreateDtos);
  }

  @MessagePattern(BatchMessagePatterns.CREATE_COMBINED_HARVESTS)
  async createCombinedHarvests(@Payload() batchCombinedCreateDto: BatchCombinedCreateDto): Promise<HttpStatus> {
    return this.batchService.createCombinedHarvests(batchCombinedCreateDto);
  }

  @MessagePattern(BatchMessagePatterns.CREATE)
  async createBatches(@Payload() batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    return this.batchService.createBatches(batchCreateDtos);
  }

  @MessagePattern(BatchMessagePatterns.READ_BY_ID)
  async readBatchById(@Payload() payload: { id: string }): Promise<BatchDto> {
    return this.batchService.readBatchById(payload.id);
  }

  @MessagePattern(CompanyMessagePatterns.READ_BATCHES)
  async readBatchesByCompanyId(@Payload() companyId: string): Promise<BatchDto[]> {
    return this.batchService.readBatchesByCompanyId(companyId);
  }

  @MessagePattern(BatchMessagePatterns.READ_BY_ID_RELATED)
  async readRelatedBatchesById(@Payload() payload: { id: string }): Promise<ProcessDisplayDto> {
    return this.relatedBatchService.readRelatedBatchesById(payload.id);
  }
}
