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

import {
  FarmerCreateDto,
  UserUpdateDto,
  UserDto,
  UserOrFarmerDto,
  UserCreateDto,
} from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as Mapper from './user.mapper';
import * as Queries from './user.queries';
import { AmqpException } from '@forest-guard/amqp';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async createUser(payload: { dto: UserCreateDto; companyId: string }): Promise<UserDto> {
    const entity = await this.prismaService.entity.create({ data: {} });
    const user = await this.prismaService.user.create(Queries.userCreate({
      dto: payload.dto,
      entityId: entity.id,
      companyId: payload.companyId,
    }));
    return Mapper.toUserDto(user);
  }

  async updateUser(payload: { id: string; dto: UserUpdateDto }): Promise<UserOrFarmerDto> {
    const user = await this.prismaService.user.update(Queries.userUpdate(payload.id, payload.dto));
    return Mapper.toUserOrFarmerDto(user);
  }

  async readUsers(): Promise<UserDto[]> {
    const users = await this.prismaService.user.findMany();
    return users.map(Mapper.toUserDto);
  }

  async readUserById(id: string): Promise<UserOrFarmerDto> {
    const user = await this.prismaService.user.findUniqueOrThrow(Queries.userOrFarmerReadById(id));
    return Mapper.toUserOrFarmerDto(user);
  }

  async createFarmer(payload: { dto: FarmerCreateDto; companyId: string }): Promise<UserOrFarmerDto> {
      const fetchedUser = await this.prismaService.user.findFirst({ where: { personalId: payload.dto.personalId, companyId: payload.companyId }});
      if(fetchedUser) {
        throw new AmqpException(`Farmer with local id '${payload.dto.personalId}' already exists for this company.`, HttpStatus.CONFLICT);
      }
      const entity = await this.prismaService.entity.create({data: {}});
      const farmer = await this.prismaService.user.create(Queries.farmerCreate({ dto: payload.dto, entityId: entity.id, companyId: payload.companyId }));
      return Mapper.toUserOrFarmerDto(farmer);
  }

  async readFarmersByCompanyId(companyId: string): Promise<UserOrFarmerDto[]> {
    const farmers = await this.prismaService.user.findMany(Queries.farmerReadByCompanyId(companyId));
    return farmers.map(Mapper.toUserOrFarmerDto);
  }
}
