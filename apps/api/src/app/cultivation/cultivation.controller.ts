/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CultivationCreateDto, CultivationDto, Role } from '@forest-guard/api-interfaces';
import { KeycloakUtil } from '@forest-guard/util';
import { Roles } from 'nest-keycloak-connect';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CultivationService } from './cultivation.service';

@ApiTags('Cultivations')
@Controller('cultivations')
@Roles({ roles: [KeycloakUtil.toRealmRole(Role.ENABLED)] })
export class CultivationController {
  constructor(private readonly cultivationService: CultivationService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a cultivation' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createCultivation(@Body() dto: CultivationCreateDto): Promise<CultivationDto> {
    return this.cultivationService.createCultivation(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all cultivations' })
  @ApiOkResponse({ description: 'Successful request.' })
  @ApiQuery({ name: 'commodity', required: true })
  getCultivationsByCommodity(@Query('commodity') commodity: string): Promise<CultivationDto[]> {
    return this.cultivationService.readCultivationsByCommodity(commodity);
  }

  @Get('commodities')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all cultivation commodities' })
  @ApiOkResponse({ description: 'Successful request.' })
  getCultivationCommodities(): string[] {
    return ['coffee'];
  }
}
