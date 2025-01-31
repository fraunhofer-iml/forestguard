/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AmqpClientEnum, CultivationMessagePatterns } from '@forest-guard/amqp';
import { CultivationCreateDto, CultivationDto } from '@forest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CultivationService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {}

  createCultivation(dto: CultivationCreateDto): Promise<CultivationDto> {
    return firstValueFrom(this.entityManagementService.send(CultivationMessagePatterns.CREATE, { dto }));
  }

  readCultivations(commodity: string, sort: string, quality: string): Promise<CultivationDto[]> {
    return firstValueFrom(this.entityManagementService.send(CultivationMessagePatterns.READ_ALL, { commodity, sort, quality }));
  }
}
