/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FarmerCreateDto,
  Role,
  TAuthenticatedUser,
  UserCreateDto,
  UserDto,
  UserOrFarmerDto,
  UserUpdateDto,
} from '@forest-guard/api-interfaces';
import { KeycloakUtil } from '@forest-guard/util';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Document } from '@prisma/client';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@Roles({ roles: [KeycloakUtil.toRealmRole(Role.ENABLED)] })
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all users' })
  @ApiOkResponse({ description: 'Successful request.' })
  getUsers(): Promise<UserDto[]> {
    return this.userService.readUsers();
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a user object' })
  @ApiOkResponse({ description: 'Successful creation.' })
  createUser(@Body() dto: UserCreateDto, @AuthenticatedUser() user: TAuthenticatedUser): Promise<UserDto> {
    return this.userService.createUser({ dto, companyId: user.sub });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Update an user' })
  @ApiOkResponse({ description: 'Successful update.' })
  updateUser(@Param('id') id: string, @Body() dto: UserUpdateDto): Promise<UserOrFarmerDto> {
    return this.userService.updateUser({ id, dto });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get user by ID' })
  @ApiOkResponse({ description: 'Successful request.' })
  getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.readUserById(id);
  }

  @Post('farmers')
  @Roles({ roles: [KeycloakUtil.toRealmRole(Role.COOPERATIVE)] })
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a farmer' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createFarmer(@Body() dto: FarmerCreateDto, @AuthenticatedUser() user: TAuthenticatedUser): Promise<UserOrFarmerDto> {
    return this.userService.createFarmer({ dto, companyId: user.sub });
  }

  @Post(':id/docs')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Create a document for a farmer' })
  @ApiParam({ name: 'id', description: 'The id of the farmer' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'The description of the document',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'The document to upload',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  addDocToFarmer(
    @Param('id') farmerId: string,
    @Body() { description }: { description: string },
    @UploadedFile() file: Express.Multer.File
  ): Promise<Document> {
    return this.userService.addFarmerDoc({ farmerId, description, file });
  }

  @Patch(':id/docs/:docRef')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Create a document for a farmer' })
  @ApiParam({ name: 'id', description: 'The id of the farmer' })
  @ApiParam({ name: 'docRef', description: 'The reference of the document' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'The description of the document',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'The document to upload',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  updateFarmerDoc(
    @Param('id') farmerId: string,
    @Param('docRef') documentRef: string,
    @Body() { description }: { description: string },
    @UploadedFile() file: Express.Multer.File
  ): Promise<Document> {
    return this.userService.updateFarmerDoc({ farmerId, documentRef, description, file });
  }

  @Delete(':id/docs/:docRef')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Delete a farmer document' })
  deleteFarmerDoc(@Param('docRef') documentRef: string): Promise<Document> {
    return this.userService.deleteFarmerDoc(documentRef);
  }
}
