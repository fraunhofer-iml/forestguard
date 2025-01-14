/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DocumentMessagePatterns } from '@forest-guard/amqp';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Document } from '@prisma/client';
import { DocumentService } from './document.service';

@Controller()
export class DocumentController {
  constructor(private readonly documentsService: DocumentService) {}

  @MessagePattern(DocumentMessagePatterns.ADD_PROCESS_STEP)
  addProcessStep(payload: { processStepId: string; description: string; file: Express.Multer.File }): Promise<Document> {
    return this.documentsService.addDocumentToProcessStep(payload);
  }

  @MessagePattern(DocumentMessagePatterns.ADD_FARMER)
  addFarmerDoc(payload: { farmerId: string; description: string; file: Express.Multer.File }): Promise<Document> {
    return this.documentsService.addFarmerDoc(payload);
  }

  @MessagePattern(DocumentMessagePatterns.UPDATE_FARMER)
  updateFarmerDoc(payload: { farmerId: string; documentRef: string; description: string; file: Express.Multer.File }): Promise<Document> {
    return this.documentsService.updateFarmerDoc(payload);
  }

  @MessagePattern(DocumentMessagePatterns.DELETE_FARMER)
  deleteFarmer(documentRef: string): Promise<Document> {
    return this.documentsService.deleteFarmerDoc(documentRef);
  }
}
