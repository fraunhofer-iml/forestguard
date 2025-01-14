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

import { AmqpClientEnum, ImportMessagePatterns } from '@forest-guard/amqp';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import 'multer';
import { ClientProxy } from '@nestjs/microservices';
import { ImportResponseDto } from '@forest-guard/api-interfaces';

@Injectable()
export class ImportService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {
  }

  importMasterData(file: Express.Multer.File, companyId: string): Promise<ImportResponseDto> {
    return firstValueFrom(this.entityManagementService.send(ImportMessagePatterns.IMPORT_MASTER_DATA, { file, companyId }));
  }
}
