/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
