import { CultivationCreateDto, CultivationDto } from '@forest-guard/api-interfaces';
import { ConfigurationService } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CultivationService {
  private readonly cultivationCommodity: string;

  constructor(private readonly prismaService: PrismaService, private readonly configurationService: ConfigurationService) {
    this.cultivationCommodity = this.configurationService.getEntityManagementConfiguration().cultivationCommodity;
  }

  async createCultivation(dto: CultivationCreateDto): Promise<CultivationDto> {
    return this.prismaService.cultivation.create({
      data: {
        commodity: this.cultivationCommodity,
        sort: dto.sort,
        quality: dto.quality,
      },
    });
  }

  async readCultivationsByCommodity(commodity: string): Promise<CultivationDto[]> {
    return this.prismaService.cultivation.findMany({ where: { commodity } });
  }
}
