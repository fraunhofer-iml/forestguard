/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchDto, CompanyCreateDto, CompanyDto, Role, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { KeycloakUtil } from '@forest-guard/util';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';

@ApiTags('Companies')
@Controller('companies')
@Roles({ roles: [KeycloakUtil.toRealmRole(Role.ENABLED)] })
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a company' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createCompany(@AuthenticatedUser() user, @Body() dto: CompanyCreateDto): Promise<CompanyDto> {
    return this.companyService.createCompany(dto, user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get company by ID' })
  @ApiOkResponse({ description: 'Successful request.' })
  getCompany(@Param('id') id: string): Promise<CompanyDto> {
    return this.companyService.readCompany(id);
  }

  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all companies' })
  @ApiOkResponse({ description: 'Successful request.' })
  @ApiQuery({
    name: 'filters',
    required: false,
    examples: {
      noFilter: { value: null, description: 'Apply no filters' },
      name: { value: { name: { contains: 'foo' } }, description: 'Filter for companies that contain the string "foo"' },
    },
  })
  @ApiQuery({
    name: 'sorting',
    required: false,
    examples: {
      noSorting: { value: null, description: 'Apply no specific sorting' },
      id: { value: { id: 'desc' }, description: 'Sort by descending company id' },
    },
  })
  getCompanies(@Query('filters') filters: string, @Query('sorting') sorting: string): Promise<CompanyDto[]> {
    return this.companyService.readCompanies(filters, sorting);
  }

  @Get(':id/batches')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all coffee batches of the company' })
  @ApiOkResponse({ description: 'Successful request.' })
  @ApiQuery({ name: 'query', required: false, example: { active: true } })
  @ApiQuery({ name: 'sorting', required: false, example: { processStep: { dateOfEntry: 'desc' } } })
  getBatches(
    @Param('id') id: string,
    @Query('query') query = '{active: true}',
    @Query('sorting') sorting = '{processStep: {dateOfEntry: "desc"}}'
  ): Promise<BatchDto[]> {
    return this.companyService.readBatchesByCompanyId(id, query, sorting);
  }

  @Get(':id/farmers')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all farmers related to the company' })
  @ApiOkResponse({ description: 'Successful request.' })
  getFarmers(@Param('id') id: string): Promise<UserOrFarmerDto[]> {
    return this.companyService.readFarmersByCompanyId(id);
  }
}
