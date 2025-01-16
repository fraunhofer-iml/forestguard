/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrismaService } from '@forest-guard/database';
import { Test, TestingModule } from '@nestjs/testing';
import { FARMER_PRISMA_MOCK } from './mocked-data/farmer.mock';
import { USER_PRISMA_MOCK } from './mocked-data/user.mock';
import * as Mapper from './user.mapper';
import * as Queries from './user.queries';
import { farmerReadByCompanyId } from './user.queries';
import { UserService } from './user.service';
import { AmqpException } from '@forest-guard/amqp';
import { HttpStatus } from '@nestjs/common';
import { FarmerCreateDto } from '@forest-guard/api-interfaces';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const givenCompanyId = 'Test Company ID';

  const givenFarmerDto: FarmerCreateDto = {
    firstName: 'Test firstName',
    lastName: 'Test lastName',
    personalId: 'Test personalId',
    address: {
      street: 'Example Street',
      postalCode: '12345',
      city: 'Example City',
      state: 'Example State',
      country: 'Example Country',
      additionalInformation: 'good to know',
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findUniqueOrThrow: jest.fn(),
            },
            entity: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user', async () => {
    const givenUserDto = {
      firstName: 'Test firstName',
      lastName: 'Test lastName',
    };

    jest.spyOn(prisma.entity, 'create').mockResolvedValue({id: FARMER_PRISMA_MOCK.id});
    jest.spyOn(prisma.user, 'create').mockResolvedValue(USER_PRISMA_MOCK);

    const response = await service.createUser({ dto: givenUserDto, companyId: 'Test Company ID' });

    expect(response).toEqual(Mapper.toUserDto(USER_PRISMA_MOCK));
    expect(prisma.entity.create).toHaveBeenCalledWith({data: {}});
    expect(prisma.user.create).toHaveBeenCalledWith(Queries.userCreate({ dto: givenUserDto, entityId: FARMER_PRISMA_MOCK.id, companyId: 'Test Company ID' }));
  });

  it('should update an user', async () => {
    const userId = 'Test User ID';

    jest.spyOn(prisma.user, 'update').mockResolvedValue(FARMER_PRISMA_MOCK);

    const response = await service.updateUser({ id: userId, dto: givenFarmerDto });

    expect(response).toEqual(Mapper.toUserOrFarmerDto(FARMER_PRISMA_MOCK));
    expect(prisma.user.update).toHaveBeenCalledWith(Queries.userUpdate(userId, givenFarmerDto));
  });

  it('should read users', async () => {

    jest.spyOn(prisma.user, 'findMany').mockResolvedValue([USER_PRISMA_MOCK, FARMER_PRISMA_MOCK]);

    const response = await service.readUsers();

    expect(response).toEqual([USER_PRISMA_MOCK, FARMER_PRISMA_MOCK].map(Mapper.toUserDto));
    expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
  });

  it('should read user by ID', async () => {
    const givenUserId = 'Test User ID';
    jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue(USER_PRISMA_MOCK);

    const response = await service.readUserById(givenUserId);

    expect(response).toEqual(Mapper.toUserOrFarmerDto({ ...USER_PRISMA_MOCK, address: undefined }));
    expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith(Queries.userOrFarmerReadById(givenUserId));
  });

  it('should read farmer by personalId', async () => {
    const givenPersonalId = 'Test personal ID';
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(USER_PRISMA_MOCK);

    const response = await service.readFarmerByPersonalId(givenPersonalId, givenCompanyId);

    expect(response).toEqual(Mapper.toUserOrFarmerDto({ ...USER_PRISMA_MOCK, address: undefined }));
    expect(prisma.user.findUnique).toHaveBeenCalledWith(Queries.farmerReadByPersonalId(givenPersonalId, givenCompanyId));
  });

  it('should create a farmer', async () => {

    jest.spyOn(prisma.entity, 'create').mockResolvedValue({id: FARMER_PRISMA_MOCK.id});
    jest.spyOn(prisma.user, 'create').mockResolvedValue(FARMER_PRISMA_MOCK);

    const response = await service.createFarmer({ dto: givenFarmerDto, companyId: 'Test Company ID' });

    expect(response).toEqual(Mapper.toUserOrFarmerDto(FARMER_PRISMA_MOCK));
    expect(prisma.entity.create).toHaveBeenCalledWith({data: {}});
    expect(prisma.user.create).toHaveBeenCalledWith(Queries.farmerCreate({ dto: givenFarmerDto, entityId: FARMER_PRISMA_MOCK.id, companyId: 'Test Company ID' }));
  });

  it('should read farmer by company ID', async () => {
    jest.spyOn(prisma.user, 'findMany').mockResolvedValue([FARMER_PRISMA_MOCK]);

    const response = await service.readFarmersByCompanyId(givenCompanyId);

    expect(response).toEqual([FARMER_PRISMA_MOCK].map(Mapper.toUserOrFarmerDto));
    expect(prisma.user.findMany).toHaveBeenCalledWith(farmerReadByCompanyId(givenCompanyId));
  });

  it('should throw an error when personalId is already used within that company', async () => {

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(FARMER_PRISMA_MOCK);
    await expect(service.createFarmer({ dto: givenFarmerDto, companyId: givenCompanyId })).rejects.toThrow(AmqpException);
    await expect(service.createFarmer({ dto: givenFarmerDto, companyId: givenCompanyId })).rejects.toMatchObject({
      error: {
        message: `Farmer with local id '${givenFarmerDto.personalId}' already exists for this company.`,
        status: HttpStatus.CONFLICT
      }
    });
  });
});
