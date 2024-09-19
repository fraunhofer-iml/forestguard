import { DocumentsMessagePatterns } from '@forest-guard/amqp';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Document } from '@prisma/client';
import { DocumentsService } from './documents.service';

@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @MessagePattern(DocumentsMessagePatterns.ADD_PROCESS_STEP)
  addProcessStep(payload: { file: Express.Multer.File; processStepId: string; description: string }): Promise<Document> {
    return this.documentsService.addDocumentToProcessStep(payload);
  }
}
