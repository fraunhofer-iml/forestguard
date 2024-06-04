import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BatchCreateDto } from '@forrest-guard/api-interfaces';
import { BatchService } from './batch.service';
import { BatchMessagePatterns } from '@forrest-guard/amqp';

@Controller()
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @MessagePattern(BatchMessagePatterns.CREATE_HARVESTS)
  async createHarvests(@Payload() batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    return this.batchService.createHarvests(batchCreateDtos);
  }

}
