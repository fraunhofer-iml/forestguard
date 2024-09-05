import { CoordinateType, GeoDataDto, Standard } from '@forest-guard/api-interfaces';
import { ConfigurationService } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { expectedPlotOfLandDto, givenGeoDataDto, givenUser } from './mocked-data/plot-of-land.mock';
import { PlotsOfLandService } from './plots-of-land.service';

describe('PlotsOfLandService', () => {
  let service: PlotsOfLandService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlotsOfLandService,
        {
          provide: PrismaService,
          useValue: {
            plotOfLand: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            cultivation: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            user: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: ConfigurationService,
          useValue: {
            getEntityManagementConfiguration: jest.fn().mockReturnValue({ cultivationType: 'coffee' }),
          },
        },
      ],
    }).compile();

    service = module.get<PlotsOfLandService>(PlotsOfLandService);
    prisma = module.get<PrismaService>(PrismaService);

    expectedPlotOfLandDto.geoData = JSON.stringify(service.createGeoDataEudr(givenGeoDataDto, givenUser));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should return a valid PlotOfLandDto', async () => {
    const givenPlotOfLandId = '1';

    jest.spyOn(prisma.plotOfLand, 'findUnique').mockResolvedValue(expectedPlotOfLandDto);

    const actualPlotOfLandDto = await service.readPlotOfLandById(givenPlotOfLandId);
    expect(actualPlotOfLandDto).toEqual(expectedPlotOfLandDto);
    expect(prisma.plotOfLand.findUnique).toHaveBeenCalledWith({
      where: {
        id: givenPlotOfLandId,
      },
      include: {
        cultivatedWith: true,
        farmer: true,
        proofs: true,
      },
    });
  });

  it('should return a list of PlotOfLandDto', async () => {
    jest.spyOn(prisma.plotOfLand, 'findMany').mockResolvedValue([expectedPlotOfLandDto]);

    const actualPlotOfLandDto = await service.readPlotsOfLand();
    expect(actualPlotOfLandDto).toEqual([expectedPlotOfLandDto]);
    expect(prisma.plotOfLand.findMany).toHaveBeenCalledWith({ where: { farmerId: undefined } });
  });

  it('should create a PlotOfLandDto with existing cultivation', async () => {
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      geoData: givenGeoDataDto,
      region: 'Region',
      localPlotOfLandId: 'Local',
      nationalPlotOfLandId: 'National',
      cultivatedWith: 'coffee',
    };

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(givenUser);
    jest.spyOn(prisma.plotOfLand, 'create').mockResolvedValue(expectedPlotOfLandDto);

    const actualPlotOfLandDto = await service.createPlotOfLand(givenPlotOfLandCreateDto, givenUser.id);
    expect(actualPlotOfLandDto).toEqual(expectedPlotOfLandDto);
    expect(prisma.plotOfLand.create).toHaveBeenCalledWith({
      data: {
        ...givenPlotOfLandCreateDto,
        geoData: JSON.stringify(service.createGeoDataEudr(givenGeoDataDto, givenUser)),
        cultivatedWith: {
          connectOrCreate: {
            where: {
              type_sort: {
                type: 'coffee',
                sort: givenPlotOfLandCreateDto.cultivatedWith.toLowerCase(),
              },
            },
            create: {
              type: 'coffee',
              sort: givenPlotOfLandCreateDto.cultivatedWith.toLowerCase(),
            },
          },
        },
        farmer: {
          connect: {
            id: '1',
          },
        },
      },
    });
  });

  it('should create a PlotOfLandDto with new cultivation', async () => {
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      geoData: givenGeoDataDto,
      region: 'Region',
      localPlotOfLandId: 'Local',
      nationalPlotOfLandId: 'National',
      cultivatedWith: 'Robusta',
    };

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(givenUser);
    jest.spyOn(prisma.plotOfLand, 'create').mockResolvedValue(expectedPlotOfLandDto);

    const actualPlotOfLandDto = await service.createPlotOfLand(givenPlotOfLandCreateDto, givenUser.id);
    expect(actualPlotOfLandDto).toEqual(expectedPlotOfLandDto);
    expect(prisma.plotOfLand.create).toHaveBeenCalledWith({
      data: {
        ...givenPlotOfLandCreateDto,
        geoData: JSON.stringify(service.createGeoDataEudr(givenGeoDataDto, givenUser)),
        cultivatedWith: {
          connectOrCreate: {
            where: {
              type_sort: {
                type: 'coffee',
                sort: givenPlotOfLandCreateDto.cultivatedWith.toLowerCase(),
              },
            },
            create: {
              type: 'coffee',
              sort: givenPlotOfLandCreateDto.cultivatedWith.toLowerCase(),
            },
          },
        },
        farmer: {
          connect: {
            id: '1',
          },
        },
      },
    });
  });

  it('should create geoData with the given inputs', () => {
    const expectedGeoDataEudr = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: CoordinateType.MultiPoint,
            coordinates: [
              [
                [1, 2],

                [3, 4],
              ],
            ],
          },
          properties: {
            ProducerName: 'Peter' + ' ' + 'Tester',
            ProducerCountry: '',
            ProductionPlace: '',
            Area: '',
          },
        },
      ],
    };

    const actualGeoDataEudr = service.createGeoDataEudr(givenGeoDataDto, givenUser);
    expect(actualGeoDataEudr).toEqual(expectedGeoDataEudr);
  });

  it('should update a PlotOfLandDto', async () => {
    const givenPlotOfLandUpdateDto = {
      cultivatedWith: '1',
    };

    jest.spyOn(prisma.plotOfLand, 'update').mockResolvedValue(expectedPlotOfLandDto);

    const actualPlotOfLandDto = await service.updatePlotOfLand('1', givenPlotOfLandUpdateDto);
    expect(actualPlotOfLandDto).toEqual(expectedPlotOfLandDto);
    expect(prisma.plotOfLand.update).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      data: {
        cultivatedWith: {
          connect: {
            id: '1',
          },
        },
      },
    });
  });

  it('should delete a PlotOfLandDto', async () => {
    jest.spyOn(prisma.plotOfLand, 'delete').mockResolvedValue(expectedPlotOfLandDto);

    const actualPlotOfLandDto = await service.deletePlotOfLand('1');
    expect(actualPlotOfLandDto).toEqual(expectedPlotOfLandDto);
    expect(prisma.plotOfLand.delete).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
  });

  it('should throw an error when trying to delete a non-existing PlotOfLandDto', async () => {
    jest.spyOn(prisma.plotOfLand, 'delete').mockRejectedValue(null);

    await expect(service.deletePlotOfLand('1')).rejects.toEqual(null);
  });

  it('should throw an error when trying to update a non-existing PlotOfLandDto', async () => {
    jest.spyOn(prisma.plotOfLand, 'update').mockRejectedValue(null);

    await expect(service.updatePlotOfLand('1', {})).rejects.toEqual(null);
  });

  it('should throw an error when trying to read a non-existing PlotOfLandDto', async () => {
    jest.spyOn(prisma.plotOfLand, 'findUnique').mockRejectedValue(null);

    await expect(service.readPlotOfLandById('1')).rejects.toEqual(null);
  });

  it('should throw an error when trying to create a PlotOfLandDto with missing data', async () => {
    const geoData = new GeoDataDto(Standard.WGS, CoordinateType.Point, [10.0, 11.2], '');
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      geoData: geoData,
      region: 'Region',
      cultivatedWith: 'Arabica',
    };

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(givenUser);
    await expect(service.createPlotOfLand(givenPlotOfLandCreateDto, givenUser.id)).resolves.toEqual(undefined);
  });

  it('should throw an error when trying to update a PlotOfLandDto with missing data', async () => {
    const givenPlotOfLandUpdateDto = {};

    await expect(service.updatePlotOfLand('1', givenPlotOfLandUpdateDto)).resolves.toEqual(undefined);
  });

  it('should throw an error when trying to create a PlotOfLandDto with invalid data', async () => {
    const geoData = new GeoDataDto(Standard.WGS, CoordinateType.Point, [10.0, 11.2], 'zone');
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      geoData: geoData,
      region: 'Region',
      localPlotOfLandId: 'Local',
      nationalPlotOfLandId: 'National',
      cultivatedWith: '1',
    };

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(givenUser);
    await expect(service.createPlotOfLand(givenPlotOfLandCreateDto, givenUser.id)).resolves.toEqual(undefined);
  });

  it('should throw an error when trying to update a PlotOfLandDto with invalid data', async () => {
    const givenPlotOfLandUpdateDto = {
      cultivatedWith: '1',
      description: 'Description',
    };

    await expect(service.updatePlotOfLand('1', givenPlotOfLandUpdateDto)).resolves.toEqual(undefined);
  });

  it('should throw an error when trying to create a PlotOfLandDto with undefined cultivatedWith', async () => {
    const geoData = new GeoDataDto(Standard.WGS, CoordinateType.Point, [10.0, 11.2]);
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      geoData: geoData,
      region: 'Region',
      localPlotOfLandId: 'Local',
      nationalPlotOfLandId: 'National',
      cultivatedWith: undefined,
    };

    const expectedException = new RpcException('Sort of Cultivation is required');
    await expect(service.createPlotOfLand(givenPlotOfLandCreateDto, givenUser.id)).rejects.toThrow(expectedException);
  });

  it('should throw an error when trying to create a PlotOfLand with undefined geoData', async () => {
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      geoData: undefined,
      region: 'Region',
      localPlotOfLandId: 'Local',
      nationalPlotOfLandId: 'National',
      cultivatedWith: 'coffee',
    };
    const expectedException = new RpcException('GeoData is required');

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(givenUser);
    await expect(service.createPlotOfLand(givenPlotOfLandCreateDto, givenUser.id)).rejects.toThrow(expectedException);
  });

  it('should throw an error when trying to create a PlotOfLand with unknown farmerId', async () => {
    const geoData = new GeoDataDto(Standard.WGS, CoordinateType.Point, [10.0, 11.2]);
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      geoData: geoData,
      region: 'Region',
      localPlotOfLandId: 'Local',
      nationalPlotOfLandId: 'National',
      cultivatedWith: 'coffee',
    };
    const expectedException = new RpcException(`Farmer with id 'unknown' not found`);

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(undefined);
    await expect(service.createPlotOfLand(givenPlotOfLandCreateDto, 'unknown')).rejects.toThrow(expectedException);
  });
});
