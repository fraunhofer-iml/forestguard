import { AmqpException } from '@forrest-guard/amqp';
import { CompanyDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CompanyMapper } from './company.mapper';
import { CompanyWithRelations } from './company.types';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

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
