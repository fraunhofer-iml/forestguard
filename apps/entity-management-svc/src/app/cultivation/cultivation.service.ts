/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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

  async readCultivations(commodity?: string, sort?: string, quality?: string): Promise<CultivationDto[]> {
    return this.prismaService.cultivation.findMany({
      where: {
        commodity: commodity,
        sort: sort,
        quality: quality,
      }
    });
  }
}
