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

import { CultivationCreateDto, CultivationDto } from '@forest-guard/api-interfaces';
import { ConfigurationService } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CultivationService {
  private readonly cultivationCommodity: string;

  constructor(private readonly prismaService: PrismaService, private readonly configurationService: ConfigurationService) {
    this.cultivationCommodity = this.configurationService.getEntityManagementConfiguration().cultivationCommodity;
  }

  async createCultivation(dto: CultivationCreateDto): Promise<CultivationDto> {
    return this.prismaService.cultivation.create({
      data: {
        commodity: this.cultivationCommodity,
        sort: dto.sort,
        quality: dto.quality,
      },
    });
  }

  async readCultivationsByCommodity(commodity: string): Promise<CultivationDto[]> {
    return this.prismaService.cultivation.findMany({ where: { commodity } });
  }
}
