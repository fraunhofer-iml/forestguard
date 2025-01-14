/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrismaService } from '@forest-guard/database';
import { FileStorageService } from '@forest-guard/file-storage';
import { Injectable } from '@nestjs/common';
import { Document } from '@prisma/client';
import { createFarmerDocQuery, createProcessDocQuery } from './document.queries';

@Injectable()
export class DocumentService {
  constructor(private readonly prismaService: PrismaService, private readonly fileStorageService: FileStorageService) {}

  async addDocumentToProcessStep({
    processStepId,
    description,
    file
  }: {
    processStepId: string;
    description: string;
    file: Express.Multer.File;
  }): Promise<Document> {
    const fileName = await this.fileStorageService.uploadFileWithDeepPath(file, `process-step`, processStepId);
    return this.prismaService.document.create(createProcessDocQuery(description, fileName, processStepId));
  }

  async addFarmerDoc({
    farmerId,
    description,
    file
  }: {
    farmerId: string;
    description: string;
    file: Express.Multer.File;
  }): Promise<Document> {
    const fileName = await this.fileStorageService.uploadFileWithDeepPath(file, `user`, farmerId);
    return this.prismaService.document.create(createFarmerDocQuery(description, fileName, farmerId));
  }

  async updateFarmerDoc({
    farmerId,
    documentRef,
    description,
    file
  }: {
    farmerId: string;
    documentRef: string;
    description: string;
    file: Express.Multer.File;
  }): Promise<Document> {
    await this.fileStorageService.uploadFile(documentRef, Buffer.from(file.buffer));
    return this.prismaService.document.update({
      where: { documentRef: documentRef },
      ...createFarmerDocQuery(description, documentRef, farmerId),
    });
  }

  async deleteFarmerDoc(documentRef: string): Promise<Document> {
    await this.fileStorageService.deleteFile(documentRef);
    return this.prismaService.document.delete({
      where: { documentRef: documentRef }
    });
  }
}
