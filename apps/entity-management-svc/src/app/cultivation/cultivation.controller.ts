/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CultivationMessagePatterns } from '@forest-guard/amqp';
import { CultivationCreateDto, CultivationDto } from '@forest-guard/api-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CultivationService } from './cultivation.service';

@Controller()
export class CultivationController {
  constructor(private cultivationService: CultivationService) {}

  @MessagePattern(CultivationMessagePatterns.CREATE)
  async createCultivation(@Payload() payload: { dto: CultivationCreateDto }): Promise<CultivationDto> {
    return this.cultivationService.createCultivation(payload.dto);
  }

  @MessagePattern(CultivationMessagePatterns.READ_ALL)
  async readCultivations(@Payload() payload: { commodity: string, sort: string, quality: string }): Promise<CultivationDto[]> {
    return this.cultivationService.readCultivations(payload.commodity, payload.sort, payload.quality);
  }
}
