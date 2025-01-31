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
  constructor(private readonly cultivationService: CultivationService) {
  }

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
  @ApiQuery({ name: 'commodity', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'quality', required: false })
  getCultivationsByCommodity(
    @Query('commodity') commodity: string,
    @Query('sort') sort: string,
    @Query('quality') quality: string,
  ): Promise<CultivationDto[]> {
    return this.cultivationService.readCultivations(commodity, sort, quality);
  }

  @Get('sorts')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all sorts' })
  @ApiOkResponse({ description: 'Successful request.' })
  @ApiQuery({ name: 'commodity', required: false })
  @ApiQuery({ name: 'quality', required: false })
  async getSorts(
    @Query('commodity') commodity: string,
    @Query('quality') quality: string,
  ): Promise<string[]> {
    const cultivations = await this.cultivationService.readCultivations(commodity, undefined, quality);
    return [...new Set(cultivations.map(cultivation => cultivation.sort))];
  }

  @Get('qualities')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all qualities' })
  @ApiOkResponse({ description: 'Successful request.' })
  @ApiQuery({ name: 'commodity', required: false })
  @ApiQuery({ name: 'sort', required: false })
  async getQualities(
    @Query('commodity') commodity: string,
    @Query('sort') sort: string,
  ): Promise<string[]> {
    const cultivations = await this.cultivationService.readCultivations(commodity, sort, undefined);
    return [...new Set(cultivations.map(cultivation => cultivation.quality))];
  }

  @Get('commodities')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all cultivation commodities' })
  @ApiOkResponse({ description: 'Successful request.' })
  getCultivationCommodities(): string[] {
    return ['coffee'];
  }
}
