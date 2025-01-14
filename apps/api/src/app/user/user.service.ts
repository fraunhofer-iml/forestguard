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

import { AmqpClientEnum, DocumentMessagePatterns, UserMessagePatterns } from '@forest-guard/amqp';
import {
  FarmerCreateDto,
  UserUpdateDto,
  UserDto,
  UserOrFarmerDto,
  UserCreateDto,
} from '@forest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import 'multer';
import { ClientProxy } from '@nestjs/microservices';
import { Document } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {}

  readUsers(): Promise<UserDto[]> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.READ_ALL, {}));
  }

  createUser(payload: { dto: UserCreateDto; companyId: string }): Promise<UserDto> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.CREATE, payload));
  }

  updateUser(payload: { id: string; dto: UserUpdateDto }): Promise<UserOrFarmerDto> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.UPDATE_BY_ID, payload));
  }

  readUserById(id: string): Promise<UserDto> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.READ_BY_ID, { id }));
  }

  createFarmer(payload: { dto: FarmerCreateDto; companyId: string }): Promise<UserOrFarmerDto> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.CREATE_FARMER, payload));
  }

  addFarmerDoc(payload: { farmerId: string; description: string; file: Express.Multer.File }): Promise<Document> {
    return firstValueFrom(this.entityManagementService.send(DocumentMessagePatterns.ADD_FARMER, payload));
  }

  updateFarmerDoc(payload: { farmerId: string; documentRef: string; description: string; file: Express.Multer.File }): Promise<Document> {
    return firstValueFrom(this.entityManagementService.send(DocumentMessagePatterns.UPDATE_FARMER, payload));
  }

  deleteFarmerDoc(documentRef: string): Promise<Document> {
    return firstValueFrom(this.entityManagementService.send(DocumentMessagePatterns.DELETE_FARMER, documentRef));
  }
}
