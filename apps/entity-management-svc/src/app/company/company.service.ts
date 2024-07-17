import { AmqpException } from '@forrest-guard/amqp';
import { CompanyCreateDto, CompanyDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
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

  async createCompany(dto: CompanyCreateDto) {
    await this.verifyUniquenessByName(dto.name);

    const entity = await this.prismaService.entity.create({
      data: {},
    });

    const { street, postalCode, city, state, country } = dto.address;
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

  // We fetch the first company on purpose!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async readCompanyById(id: string): Promise<CompanyDto> {
    const company: CompanyWithRelations = await this.prismaService.company.findFirst({
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

    if (!company) {
      throw new AmqpException('No Company found.', HttpStatus.NOT_FOUND);
    }

    return CompanyMapper.mapCompanyPrismaToCompanyDto(company);
  }
}
