import { DocumentsMessagePatterns } from '@forest-guard/amqp';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Document } from '@prisma/client';
import { DocumentsService } from './documents.service';

@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @MessagePattern(DocumentsMessagePatterns.ADD_PROCESS_STEP)
  addProcessStep(payload: { processStepId: string; description: string; file: Express.Multer.File }): Promise<Document> {
    return this.documentsService.addDocumentToProcessStep(payload);
  }

  @MessagePattern(DocumentsMessagePatterns.ADD_FARMER)
  addFarmerDoc(payload: { farmerId: string; description: string; file: Express.Multer.File }): Promise<Document> {
    return this.documentsService.addFarmerDoc(payload);
  }

  @MessagePattern(DocumentsMessagePatterns.UPDATE_FARMER)
  updateFarmerDoc(payload: { farmerId: string; documentRef: string; description: string; file: Express.Multer.File }): Promise<Document> {
    return this.documentsService.updateFarmerDoc(payload);
  }

  @MessagePattern(DocumentsMessagePatterns.DELETE_FARMER)
  deleteFarmer(documentRef: string): Promise<Document> {
    return this.documentsService.deleteFarmerDoc(documentRef);
  }
}
