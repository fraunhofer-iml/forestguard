/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrismaService } from '@forest-guard/database';
import { FileStorageModule } from '@forest-guard/file-storage';
import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [FileStorageModule],
  controllers: [DocumentController],
  providers: [PrismaService, DocumentService],
})
export class DocumentModule {}
