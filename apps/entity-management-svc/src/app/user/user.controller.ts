/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
