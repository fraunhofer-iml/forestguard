import { CultivationCreateDto, CultivationDto } from '@forrest-guard/api-interfaces';
import { ConfigurationService } from '@forrest-guard/configuration';
import { PrismaService } from '@forrest-guard/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CultivationService {
  private readonly cultivationType: string;

  constructor(private readonly prismaService: PrismaService, private readonly configurationService: ConfigurationService) {
    this.cultivationType = this.configurationService.getEntityManagementConfiguration().cultivationType;
  }

  async createCultivation(dto: CultivationCreateDto): Promise<CultivationDto> {
    return this.prismaService.cultivation.create({
      data: {
        type: this.cultivationType,
        sort: dto.sort,
      },
    });
  }

  async readCultivationsByType(type: string): Promise<CultivationDto[]> {
    return this.prismaService.cultivation.findMany({ where: { type } });
  }
}
