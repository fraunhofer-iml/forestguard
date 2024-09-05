import { GeoDataDto, PlotOfLandCreateDto, PlotOfLandDto, PlotOfLandUpdateDto } from '@forest-guard/api-interfaces';
import { ConfigurationService } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { User } from '@prisma/client';

@Injectable()
export class PlotsOfLandService {
  private readonly cultivationType: string;

  constructor(private readonly prismaService: PrismaService, private readonly configurationService: ConfigurationService) {
    const generalConfiguration = this.configurationService.getEntityManagementConfiguration();
    this.cultivationType = generalConfiguration.cultivationType;
  }

  async readPlotsOfLand(farmerId?: string | undefined): Promise<PlotOfLandDto[]> {
    return await this.prismaService.plotOfLand.findMany({
      where: {
        farmerId: farmerId ? farmerId : undefined,
      },
    });
  }

  async readPlotOfLandById(id: string): Promise<PlotOfLandDto> {
    return this.prismaService.plotOfLand.findUnique({
      where: { id },
      include: {
        cultivatedWith: true,
        farmer: true,
        proofs: true,
      },
    });
  }

  async createPlotOfLand(plotOfLand: PlotOfLandCreateDto, farmerId: string): Promise<PlotOfLandDto> {
    if (!plotOfLand.cultivatedWith) {
      throw new RpcException('Sort of Cultivation is required');
    }

    if (!plotOfLand.geoData) {
      throw new RpcException('GeoData is required');
    }

    const farmer = await this.prismaService.user.findFirst({ where: { id: farmerId } });

    if (!farmer) {
      throw new RpcException(`Farmer with id '${farmerId}' not found`);
    }

    const geoDataEudr = this.createGeoDataEudr(plotOfLand.geoData, farmer);

    return this.prismaService.plotOfLand.create({
      data: {
        areaInHA: plotOfLand.areaInHA,
        country: plotOfLand.country,
        description: plotOfLand.description,
        district: plotOfLand.district,
        geoData: JSON.stringify(geoDataEudr),
        region: plotOfLand.region,
        localPlotOfLandId: plotOfLand.localPlotOfLandId,
        nationalPlotOfLandId: plotOfLand.nationalPlotOfLandId,
        cultivatedWith: {
          connectOrCreate: {
            where: {
              type_sort: {
                type: this.cultivationType,
                sort: plotOfLand.cultivatedWith.toLowerCase(),
              },
            },
            create: {
              type: this.cultivationType,
              sort: plotOfLand.cultivatedWith.toLowerCase(),
            },
          },
        },
        farmer: {
          connect: {
            id: farmer.id,
          },
        },
      },
    });
  }

  createGeoDataEudr(geoDataDto: GeoDataDto, farmerEntity: User) {
    // TODO-MP: Activate this precondition check after the frontend (FOR-293) is ready
    /*
    if (!geoDataDto.type) {
      throw new RpcException('GeoData type is required');
    }

    if (!geoDataDto.coordinates) {
      throw new RpcException('GeoData coordinates are required');
    }
    */

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: geoDataDto.coordinateType,
            coordinates: geoDataDto.coordinates,
          },
          properties: {
            ProducerName: farmerEntity.firstName + ' ' + farmerEntity.lastName,
            ProducerCountry: '',
            ProductionPlace: '',
            Area: '',
          },
        },
      ],
    };
  }

  async updatePlotOfLand(id: string, plotOfLand: PlotOfLandUpdateDto): Promise<PlotOfLandDto> {
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

  async deletePlotOfLand(id: string): Promise<PlotOfLandDto> {
    return this.prismaService.plotOfLand.delete({ where: { id } });
  }
}
