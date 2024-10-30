import { AmqpException } from '@forest-guard/amqp';
import { CompanyCreateDto, CompanyDto } from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import JSON5 from 'json5';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CompanyMapper } from './company.mapper';
import { CompanyWithRelations } from './company.types';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

  private async verifyUniquenessByName(name: string): Promise<void> {
    const numberOfCompanies = await this.prismaService.company.count({
      where: {
        name,
      },
    });

    if (numberOfCompanies > 0) {
      throw new AmqpException(`Company with name '${name}' already exists.`, HttpStatus.CONFLICT);
    }
  }

  async createCompany(dto: CompanyCreateDto, keycloakCompanyId: string) {
    await this.verifyUniquenessByName(dto.name);

    const entity = await this.prismaService.entity.create({
      data: { id: keycloakCompanyId },
    });

    const { street, postalCode, city, state, country, additionalInformation } = dto.address;
    const company = await this.prismaService.company.create({
      data: {
        id: entity.id,
        name: dto.name,
        entity: {
          connect: {
            id: entity.id,
          },
        },
        address: {
          connectOrCreate: {
            create: {
              street,
              postalCode,
              city,
              state,
              country,
              additionalInformation,
            },
            where: {
              street_postalCode_city_state_country: {
                street,
                postalCode,
                city,
                state,
                country,
              },
            },
          },
        },
      },
      include: {
        address: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { entityId: _, addressId: __, ...companyWithoutIds } = company;
    return companyWithoutIds;
  }

  async readCompanyById(id: string): Promise<CompanyDto> {
    const company: CompanyWithRelations = await this.prismaService.company.findUniqueOrThrow({
      where: { entityId: id },
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
    });

    return CompanyMapper.mapCompanyPrismaToCompanyDto(company);
  }

  /**
   * Reads a list of companies from the database based on the provided filters and sorting criteria.
   *
   * @param filters - A JSON string representing the filtering criteria to be applied to the companies query.
   * @param sorting - A JSON string representing the sorting criteria to be applied to the companies query.
   * @returns A promise that resolves to an array of CompanyDto objects.
   * @throws AmqpException if no companies are found.
   */
  async readCompanies(filters?: string, sorting?: string): Promise<CompanyDto[]> {
    const companies: CompanyWithRelations[] = await this.prismaService.company.findMany({
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
      where: JSON5.parse(filters || '{}'),
      orderBy: JSON5.parse(sorting || '{}'),
    });

    if (!companies) {
      throw new AmqpException('No companies found.', HttpStatus.NOT_FOUND);
    }

    return companies.map((company: CompanyWithRelations) => CompanyMapper.mapCompanyPrismaToCompanyDto(company));
  }
}
