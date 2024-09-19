import { AmqpClientEnum, DocumentsMessagePatterns } from '@forest-guard/amqp';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Document } from '@prisma/client';

@Injectable()
export class ProcessStepService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {}

  addDocToProcessStep(payload: { file: Express.Multer.File; processStepId: string; description: string }): Promise<Document> {
    return firstValueFrom(this.entityManagementService.send(DocumentsMessagePatterns.ADD_PROCESS_STEP, payload));
  }
}
