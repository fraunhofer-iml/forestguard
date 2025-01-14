/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AmqpException } from '@forest-guard/amqp';
import { PrismaService } from '@forest-guard/database';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyMapper } from './company.mapper';
import { CompanyService } from './company.service';
import { CompanyWithRelations } from './company.types';
import { ADDRESS_MOCK } from './mocked-data/address.mock';
import { COMPANY_PRISMA_MOCK } from './mocked-data/company.mock';

describe('CompanyService', () => {
  let companyService: CompanyService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: PrismaService,
          useValue: {
            address: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
            company: {
              count: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
            entity: {
              create: jest.fn().mockResolvedValue({ id: '1' }),
            },
          },
        },
      ],
    }).compile();

    companyService = module.get<CompanyService>(CompanyService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(companyService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('should create a company successfully', async () => {
    const givenDto = {
      name: 'Acme Corporation',
      address: ADDRESS_MOCK,
    };

    jest.spyOn(prismaService.company, 'count').mockResolvedValue(0);
    jest.spyOn(prismaService.address, 'findFirst').mockResolvedValue(null);
    jest.spyOn(prismaService.address, 'create').mockResolvedValue({
      id: '1',
      street: givenDto.address.street,
      postalCode: givenDto.address.postalCode,
      city: givenDto.address.city,
      state: givenDto.address.state,
      country: givenDto.address.country,
      additionalInformation: givenDto.address.additionalInformation,
    });
    jest.spyOn(prismaService.entity, 'create').mockResolvedValue({
      id: '1',
    });
    jest.spyOn(prismaService.company, 'create').mockResolvedValue({
      id: '1',
      name: givenDto.name,
      entityId: '1',
      addressId: '1',
    });

    const actualResult = await companyService.createCompany(givenDto, '1');
    expect(actualResult).toBeDefined();
    expect(prismaService.company.create).toHaveBeenCalledWith({
      data: {
        id: '1',
        name: givenDto.name,
        entity: {
          connect: {
            id: '1',
          },
        },
        address: {
          create: {
            street: givenDto.address.street,
            postalCode: givenDto.address.postalCode,
            city: givenDto.address.city,
            state: givenDto.address.state,
            country: givenDto.address.country,
            additionalInformation: givenDto.address.additionalInformation,
          },
        },
      },
      include: {
        address: true,
      },
    });
  });

  it('should throw an error if company name is not unique', async () => {
    jest.spyOn(prismaService.company, 'count').mockResolvedValue(1);

    const givenDto = {
      name: 'Acme Corporation',
      address: ADDRESS_MOCK,
    };

    await expect(companyService.createCompany(givenDto, '1')).rejects.toThrow(AmqpException);
    await expect(companyService.createCompany(givenDto, '1')).rejects.toMatchObject({
      error: {
        message: 'Company with name \'Acme Corporation\' already exists.',
        status: HttpStatus.CONFLICT,
      },
    });
  });

  it('should fetch a company successfully', async () => {
    const givenCompanyId = COMPANY_PRISMA_MOCK.id;
    const expectedResult = CompanyMapper.mapCompanyPrismaToCompanyDto(COMPANY_PRISMA_MOCK);

    jest.spyOn(prismaService.company, 'findUnique').mockResolvedValue(COMPANY_PRISMA_MOCK);
    const actualResult = await companyService.readCompanyById(givenCompanyId);

    expect(actualResult).toEqual(expectedResult);

    expect(prismaService.company.findUnique).toHaveBeenCalledWith({
      include: {
        address: true,
        users: {
          orderBy: {
            lastName: 'asc',
          },
          include: {
            address: true,
            plotsOfLand: {
              include: {
                cultivatedWith: true,
                proofs: true,
              },
            },
          },
        },
      },
      where: {
        entityId: givenCompanyId,
      },
    });
  });

  it('should throw an error if no company was found', async () => {
    const givenCompanyId = '1';

    jest.spyOn(prismaService.company, 'findUnique').mockRejectedValue(new AmqpException('', 404));

    await expect(companyService.readCompanyById(givenCompanyId)).rejects.toThrow(AmqpException);
  });

  it('should fetch all companies without specification of filtering and ordering', async () => {
    const mockCompanies = [COMPANY_PRISMA_MOCK, { ...COMPANY_PRISMA_MOCK, name: 'foobar' }];
    const expectedResult = mockCompanies.map((company: CompanyWithRelations) => CompanyMapper.mapCompanyPrismaToCompanyDto(company));
    const mapCompanySpy = jest.spyOn(CompanyMapper, 'mapCompanyPrismaToCompanyDto');

    jest.spyOn(prismaService.company, 'findMany').mockResolvedValue(mockCompanies);
    const actualResult = await companyService.readCompanies();

    expect(actualResult).toEqual(expectedResult);
    expect(mapCompanySpy).toHaveBeenNthCalledWith(1, mockCompanies[0]);
    expect(mapCompanySpy).toHaveBeenNthCalledWith(2, mockCompanies[1]);
    expect(prismaService.company.findMany).toHaveBeenCalledWith({
      include: {
        address: true,
        users: {
          include: {
            address: true,
            plotsOfLand: {
              include: {
                cultivatedWith: true,
                proofs: true,
              },
            },
          },
        },
      },
      where: {},
      orderBy: {},
    });
  });

  it('should throw an error if no company was found', async () => {
    jest.spyOn(prismaService.company, 'findMany').mockResolvedValue(null);

    await expect(companyService.readCompanies()).rejects.toThrow(AmqpException);
    await expect(companyService.readCompanies()).rejects.toMatchObject({
      error: {
        message: 'No companies found.',
        status: HttpStatus.NOT_FOUND,
      },
    });
  });
});
