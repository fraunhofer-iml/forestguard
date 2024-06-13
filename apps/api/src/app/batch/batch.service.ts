import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AmqpClientEnum, BatchMessagePatterns } from '@forrest-guard/amqp';
import { ClientProxy } from '@nestjs/microservices';
import { BatchCreateDto, BatchDto, ProcessDisplayDto } from '@forrest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BatchService {
  constructor(@Inject(AmqpClientEnum.QUEUE_PROCESS) private readonly processService: ClientProxy) {
  }

  createHarvests(batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    return firstValueFrom(this.processService.send(BatchMessagePatterns.CREATE_HARVESTS, batchCreateDtos));
  }

  createBatches(batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    return firstValueFrom(this.processService.send(BatchMessagePatterns.CREATE, batchCreateDtos));
  }

  readBatch(id: string): Promise<BatchDto> {
    return firstValueFrom(this.processService.send(BatchMessagePatterns.READ_BY_ID, { id }));
  }

  getRelatedBatches(id: string): Promise<ProcessDisplayDto> {
    return firstValueFrom(this.processService.send(BatchMessagePatterns.READ_BY_ID_RELATED, { id }));
  }
}
