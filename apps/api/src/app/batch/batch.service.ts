import { AmqpClientEnum, BatchMessagePatterns } from '@forrest-guard/amqp';
import { BatchCombinedCreateDto, BatchCreateDto, BatchDto, BatchExportWrapperDto, ProcessDisplayDto } from '@forrest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BatchService {
  constructor(@Inject(AmqpClientEnum.QUEUE_PROCESS) private readonly processService: ClientProxy) {}

  createHarvests(batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    return firstValueFrom(this.processService.send(BatchMessagePatterns.CREATE_HARVESTS, batchCreateDtos));
  }

  createCombinedHarvests(batchCombinedCreateDto: BatchCombinedCreateDto): Promise<HttpStatus> {
    return firstValueFrom(this.processService.send(BatchMessagePatterns.CREATE_COMBINED_HARVESTS, batchCombinedCreateDto));
  }

  createBatches(batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
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
}
