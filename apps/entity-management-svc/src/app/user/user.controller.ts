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

import { UserMessagePatterns } from '@forest-guard/amqp';
import {
  FarmerCreateDto,
  UserUpdateDto,
  UserDto,
  UserOrFarmerDto,
  UserCreateDto,
} from '@forest-guard/api-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @MessagePattern(UserMessagePatterns.CREATE)
  async createUser(@Payload() payload: { dto: UserCreateDto; companyId: string }): Promise<UserDto> {
    return this.service.createUser(payload);
  }

  @MessagePattern(UserMessagePatterns.UPDATE_BY_ID)
  async updateUser(@Payload() payload: { id: string; dto: UserUpdateDto }): Promise<UserOrFarmerDto> {
    return this.service.updateUser(payload);
  }

  @MessagePattern(UserMessagePatterns.READ_ALL)
  async readUsers(): Promise<UserDto[]> {
    return this.service.readUsers();
  }

  @MessagePattern(UserMessagePatterns.READ_BY_ID)
  async readUserById(@Payload() payload: { id: string }): Promise<UserOrFarmerDto> {
    return this.service.readUserById(payload.id);
  }

  @MessagePattern(UserMessagePatterns.CREATE_FARMER)
  async createFarmer(@Payload() payload: { dto: FarmerCreateDto; companyId: string }): Promise<UserOrFarmerDto> {
    return this.service.createFarmer(payload);
  }

  @MessagePattern(UserMessagePatterns.READ_FARMER_BY_COMPANY_ID)
  async readFarmersByCompanyId(@Payload() payload: { companyId: string }): Promise<UserOrFarmerDto[]> {
    return this.service.readFarmersByCompanyId(payload.companyId);
  }
}
