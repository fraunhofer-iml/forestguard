/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Role } from '@forest-guard/api-interfaces';
import { KeycloakUtil } from '@forest-guard/util';
import { Roles } from 'nest-keycloak-connect';
import { Body, Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Document } from '@prisma/client';
import { ProcessStepService } from './process-step.service';

@ApiTags('Process Steps')
@Controller('process-steps')
@Roles({ roles: [KeycloakUtil.toRealmRole(Role.ENABLED)] })
export class ProcessStepController {
  constructor(private readonly processStepService: ProcessStepService) {}

  @Post(':id/docs')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Create a document for process steps' })
  @ApiParam({ name: 'id', description: 'The id of the process step' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'The description of the document',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'The document to upload',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  addDocToProcessStep(
    @Param('id') processStepId: string,
    @Body() { description }: { description: string },
    @UploadedFile() file: Express.Multer.File
  ): Promise<Document> {
    return this.processStepService.addDocToProcessStep({ processStepId, description, file });
  }
}
