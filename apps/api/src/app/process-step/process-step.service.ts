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

import { AmqpClientEnum, DocumentMessagePatterns } from '@forest-guard/amqp';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Document } from '@prisma/client';

@Injectable()
export class ProcessStepService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {}

  addDocToProcessStep(payload: { processStepId: string; description: string; file: Express.Multer.File }): Promise<Document> {
    return firstValueFrom(this.entityManagementService.send(DocumentMessagePatterns.ADD_PROCESS_STEP, payload));
  }
}
