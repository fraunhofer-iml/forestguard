/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImportResponseDto, Role, TAuthenticatedUser } from '@forest-guard/api-interfaces';
import { KeycloakUtil } from '@forest-guard/util';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImportService } from './import.service';

@ApiTags('Import')
@Controller('import')
@Roles({ roles: [KeycloakUtil.toRealmRole(Role.ENABLED)] })
export class ImportController {
  constructor(private importService: ImportService) {}

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Import master data from an excel file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file with master data',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  importMasterData(@UploadedFile() file: Express.Multer.File, @AuthenticatedUser() user: TAuthenticatedUser): Promise<ImportResponseDto> {
    return this.importService.importMasterData(file, user.sub);
  }
}
