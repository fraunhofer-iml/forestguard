/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PlotOfLandCreateDto,
  PlotOfLandDto,
  PlotOfLandUpdateDto,
  ProofCreateDto,
  ProofDto,
  Role,
  TAuthenticatedUser,
} from '@forest-guard/api-interfaces';
import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import 'multer';
import { KeycloakUtil } from '@forest-guard/util';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { PlotOfLandService } from './plot-of-land.service';
import { ProofUploadDto } from './proof-upload.dto';

@ApiTags('PlotsOfLand')
@Controller('pols')
@Roles({ roles: [KeycloakUtil.toRealmRole(Role.ENABLED)] })
export class PlotOfLandController {
  constructor(private plotOfLandService: PlotOfLandService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all plot of lands of a farmer' })
  @ApiOkResponse({ description: 'Successful request.' })
  getPlotsOfLand(@Query('farmerId') farmerId?: string): Promise<PlotOfLandDto[]> {
    return this.plotOfLandService.readPlotsOfLand(farmerId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a plot of land for a farmer' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createPlotOfLand(
    @Query('farmerId') farmerId: string,
    @Body() plotOfLandCreateDto: PlotOfLandCreateDto,
    @AuthenticatedUser() user: TAuthenticatedUser
  ): Promise<PlotOfLandDto> {
    return this.plotOfLandService.createPlotOfLand({ plotOfLand: plotOfLandCreateDto, farmerId, companyId: user.sub });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get plot of land by ID' })
  @ApiOkResponse({ description: 'Successful request.' })
  getPlotOfLandById(@Param('id') id: string): Promise<PlotOfLandDto> {
    return this.plotOfLandService.readPlotOfLandById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create or update the seeding for a plot of land' })
  @ApiOkResponse({ description: 'Successful creation.' })
  createOrUpdatePlotOfLand(@Param('id') id: string, @Body() plotOfLandUpdateDto: PlotOfLandUpdateDto): Promise<PlotOfLandDto> {
    return this.plotOfLandService.updatePlotOfLand({ plotOfLand: plotOfLandUpdateDto, id });
  }

  @Post(':id/proofs')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Create a proof for a plot of land' })
  @ApiBody({
    description: 'The proof of the given plot of land. Either of type `PROOF_OF_FREEDOM` of `PROOF_OF_OWNERSHIP`.',
    type: ProofUploadDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Successful creation.' })
  postProof(@Param('id') plotOfLandId: string, @Body() dto: ProofCreateDto, @UploadedFile() file: Express.Multer.File): Promise<ProofDto> {
    return this.plotOfLandService.createProof(plotOfLandId, dto, file);
  }

  @Get(':id/proofs')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all proofs of a plot of land' })
  @ApiOkResponse({ description: 'Successful request.' })
  getProofsByPlotOfLandId(@Param('id') id: string): Promise<ProofDto[]> {
    return this.plotOfLandService.readProofsByPlotOfLandId(id);
  }
}
