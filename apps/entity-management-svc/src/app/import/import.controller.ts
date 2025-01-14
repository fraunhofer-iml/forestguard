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

import { ImportMessagePatterns } from '@forest-guard/amqp';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ImportService } from './import.service';
import { ImportResponseDto } from '@forest-guard/api-interfaces';

@Controller()
export class ImportController {
  constructor(private readonly importService: ImportService) {
  }

  @MessagePattern(ImportMessagePatterns.IMPORT_MASTER_DATA)
  importMasterData(@Payload() payload: {file: Express.Multer.File, companyId: string}): Promise<ImportResponseDto> {
    return this.importService.importMasterData(payload);
  }
}
