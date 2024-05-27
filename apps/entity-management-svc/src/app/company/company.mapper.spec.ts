import { CompanyDto } from '@forrest-guard/api-interfaces';
import { BadRequestException } from '@nestjs/common';
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
    const expectedException = BadRequestException;

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

  it('should return an empty array for plotOfLands when plotsOfLand is null', () => {
    givenCompanyPrisma.users[1].plotsOfLand = null;

    expectedCompanyDto.farmers[0].plotOfLands = [];

    const actualCompanyDto = CompanyMapper.mapCompanyPrismaToCompanyDto(givenCompanyPrisma);
    expect(actualCompanyDto).toEqual(expectedCompanyDto);
    expect(actualCompanyDto.farmers[0].plotOfLands).toHaveLength(0);
  });

  it('should return an empty array for proofs when proofs is null', () => {
    givenCompanyPrisma.users[1].plotsOfLand[0].proofs = null;

    expectedCompanyDto.farmers[0].plotOfLands[0].proofs = [];

    const actualCompanyDto = CompanyMapper.mapCompanyPrismaToCompanyDto(givenCompanyPrisma);
    expect(actualCompanyDto).toEqual(expectedCompanyDto);
    expect(actualCompanyDto.farmers[0].plotOfLands[0].proofs).toHaveLength(0);
  });
});
