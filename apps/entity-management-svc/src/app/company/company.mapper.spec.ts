/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AmqpException } from '@forest-guard/amqp';
import { CompanyDto } from '@forest-guard/api-interfaces';
import { CompanyMapper } from './company.mapper';
import { CompanyWithRelations } from './company.types';
import { COMPANY_DTO_MOCK, COMPANY_PRISMA_MOCK } from './mocked-data/company.mock';

describe('CompanyMapper', () => {
  let givenCompanyPrisma: CompanyWithRelations;
  let expectedCompanyDto: CompanyDto;

  beforeEach(() => {
    givenCompanyPrisma = JSON.parse(JSON.stringify(COMPANY_PRISMA_MOCK));
    expectedCompanyDto = JSON.parse(JSON.stringify(COMPANY_DTO_MOCK));
  });

  it('should correctly map a company to a CompanyDto', () => {
    const actualCompanyDto = CompanyMapper.mapCompanyPrismaToCompanyDto(givenCompanyPrisma);

    expect(actualCompanyDto).toEqual(expectedCompanyDto);
  });

  it('should throw an exception when the company is null', () => {
    givenCompanyPrisma = null;
    const expectedException = AmqpException;

    expect(() => CompanyMapper.mapCompanyPrismaToCompanyDto(givenCompanyPrisma)).toThrow(expectedException);
  });

  it('should return null for address when address is null', () => {
    givenCompanyPrisma.address = null;

    expectedCompanyDto.address = null;

    const actualCompanyDto = CompanyMapper.mapCompanyPrismaToCompanyDto(givenCompanyPrisma);
    expect(actualCompanyDto).toEqual(expectedCompanyDto);
    expect(actualCompanyDto.address).toBeNull();
  });

  it('should return an empty array for employees and farmers when users is null', () => {
    givenCompanyPrisma.users = null;

    expectedCompanyDto.employees = [];
    expectedCompanyDto.farmers = [];

    const actualCompanyDto = CompanyMapper.mapCompanyPrismaToCompanyDto(givenCompanyPrisma);
    expect(actualCompanyDto).toEqual(expectedCompanyDto);
    expect(actualCompanyDto.employees).toHaveLength(0);
    expect(actualCompanyDto.farmers).toHaveLength(0);
  });

  it('should return an empty array for plotsOfLand when plotsOfLand is null', () => {
    givenCompanyPrisma.users[1].plotsOfLand = null;

    expectedCompanyDto.farmers[0].plotsOfLand = [];

    const actualCompanyDto = CompanyMapper.mapCompanyPrismaToCompanyDto(givenCompanyPrisma);
    expect(actualCompanyDto).toEqual(expectedCompanyDto);
    expect(actualCompanyDto.farmers[0].plotsOfLand).toHaveLength(0);
  });

  it('should return an empty array for proofs when proofs is null', () => {
    givenCompanyPrisma.users[1].plotsOfLand[0].proofs = null;

    expectedCompanyDto.farmers[0].plotsOfLand[0].proofs = [];

    const actualCompanyDto = CompanyMapper.mapCompanyPrismaToCompanyDto(givenCompanyPrisma);
    expect(actualCompanyDto).toEqual(expectedCompanyDto);
    expect(actualCompanyDto.farmers[0].plotsOfLand[0].proofs).toHaveLength(0);
  });
});
