import { PlotOfLandCreateDto, PlotOfLandUpdateDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { Injectable } from '@nestjs/common';
import { PlotOfLand } from '@prisma/client';

@Injectable()
export class PlotsOfLandService {
  constructor(private readonly prismaService: PrismaService) {}

  async readPlotsOfLand(farmerId?: string | undefined): Promise<PlotOfLand[]> {
    return await this.prismaService.plotOfLand.findMany({
      where: {
        farmerId: farmerId ? farmerId : undefined,
      },
    });
  }

  async readPlotOfLandById(id: string): Promise<PlotOfLand> {
    return this.prismaService.plotOfLand.findUnique({ where: { id } });
  }

  async createPlotOfLand(plotOfLand: PlotOfLandCreateDto, farmerId: string): Promise<PlotOfLand> {
    // TODO: Implement farmer and cultivatedWith if required by release 2 of forrest guard
    const { areaInHA, country, description, district, polygonData, region, localPlotOfLandId, nationalPlotOfLandId } = plotOfLand;
    return this.prismaService.plotOfLand.create({
      data: {
        areaInHA: areaInHA || 0,
        country: country || '',
        description: description || '',
        district: district || '',
        polygonData: polygonData || '',
        region: region || '',
        localPlotOfLandId: localPlotOfLandId || '',
        nationalPlotOfLandId: nationalPlotOfLandId || '',
        farmer: {
          connect: {
            id: farmerId,
          },
        },
      },
    });
  }

  async updatePlotOfLand(id: string, plotOfLand: PlotOfLandUpdateDto): Promise<PlotOfLand> {
    const { cultivatedWith } = plotOfLand;
    return this.prismaService.plotOfLand.update({
      where: { id },
      data: {
        cultivatedWith: {
          connect: {
            id: cultivatedWith || '',
          },
        },
      },
    });
  }

  async deletePlotOfLand(id: string): Promise<PlotOfLand> {
    return this.prismaService.plotOfLand.delete({ where: { id } });
  }
}
