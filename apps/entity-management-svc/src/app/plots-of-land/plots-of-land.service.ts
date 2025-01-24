/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Coordinates, GeoDataDto, PlotOfLandCreateDto, PlotOfLandDto, PlotOfLandUpdateDto, Standard } from '@forest-guard/api-interfaces';
import { BlockchainConnectorService } from '@forest-guard/blockchain-connector';
import { ConfigurationService } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { convertCoordinates } from '@forest-guard/utm';

@Injectable()
export class PlotsOfLandService {
  private readonly cultivationCommodity: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configurationService: ConfigurationService,
    private readonly blockchainConnectorService: BlockchainConnectorService
  ) {
    const generalConfiguration = this.configurationService.getEntityManagementConfiguration();
    this.cultivationCommodity = generalConfiguration.cultivationCommodity;
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
    if (!plotOfLand.cultivationSort) {
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

    const createdPlotOfLand = await this.prismaService.plotOfLand.create({
      data: {
        areaInHA: plotOfLand.areaInHA,
        country: plotOfLand.country,
        description: plotOfLand.description,
        district: plotOfLand.district,
        geoData: JSON.stringify(geoDataEudr),
        region: plotOfLand.region,
        province: plotOfLand.province,
        localPlotOfLandId: plotOfLand.localPlotOfLandId,
        nationalPlotOfLandId: plotOfLand.nationalPlotOfLandId,
        cultivatedWith: {
          connectOrCreate: {
            where: {
              commodity_sort_quality: {
                commodity: this.cultivationCommodity,
                sort: plotOfLand.cultivationSort.toLowerCase(),
                quality: plotOfLand.cultivationQuality.toLowerCase(),
              },
            },
            create: {
              commodity: this.cultivationCommodity,
              sort: plotOfLand.cultivationSort.toLowerCase(),
              quality: plotOfLand.cultivationQuality.toLowerCase(),
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

    await this.blockchainConnectorService.mintPlotOfLandNft(createdPlotOfLand);

    return createdPlotOfLand;
  }

  createGeoDataEudr(geoDataDto: GeoDataDto, farmerEntity: User) {
    if (!geoDataDto.coordinateType) {
      throw new RpcException('GeoData type is required');
    }

    if (!geoDataDto.coordinates) {
      throw new RpcException('GeoData coordinates are required');
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: geoDataDto.coordinateType,
            coordinates: (geoDataDto.standard === Standard.UTM) ? this.convertToWgsCoordinates(geoDataDto) : geoDataDto.coordinates,
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

  private convertToWgsCoordinates(geoDataDto: GeoDataDto): Coordinates {
    return convertCoordinates(geoDataDto.coordinates, geoDataDto.zone, geoDataDto.coordinateType);
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
