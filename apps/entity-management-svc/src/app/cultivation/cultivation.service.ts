import { CultivationDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CultivationService {
  constructor(private readonly prismaService: PrismaService) {}

  async readCultivationsByType(type: string): Promise<CultivationDto[]> {
    return this.prismaService.cultivation.findMany({ where: { type } });
  }
}
