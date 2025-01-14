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
