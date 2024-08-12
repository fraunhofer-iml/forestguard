import { ConfigurationService } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { PlotOfLand } from '@prisma/client';
import { PlotsOfLandService } from './plots-of-land.service';

const PLOT_OF_LAND_TEST_DTO: PlotOfLand = {
  id: '1',
  areaInHA: 1,
  country: 'Germany',
  description: 'Description',
  district: 'District',
  polygonData: 'Polygon',
  region: 'Region',
  localPlotOfLandId: 'Local',
  nationalPlotOfLandId: 'National',
  cultivationId: '1',
  farmerId: '1',
};

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should return a valid PlotOfLandDto', async () => {
    const givenPlotOfLandId = '1';

    jest.spyOn(prisma.plotOfLand, 'findUnique').mockResolvedValue(PLOT_OF_LAND_TEST_DTO);
    const actualPlotOfLandDto = await service.readPlotOfLandById(givenPlotOfLandId);

    expect(actualPlotOfLandDto).toEqual(PLOT_OF_LAND_TEST_DTO);

    expect(prisma.plotOfLand.findUnique).toHaveBeenCalledWith({
      where: {
        id: givenPlotOfLandId,
      },
    });
  });

  it('should return a list of PlotOfLandDto', async () => {
    jest.spyOn(prisma.plotOfLand, 'findMany').mockResolvedValue([PLOT_OF_LAND_TEST_DTO]);
    const actualPlotOfLandDto = await service.readPlotsOfLand();

    expect(actualPlotOfLandDto).toEqual([PLOT_OF_LAND_TEST_DTO]);

    expect(prisma.plotOfLand.findMany).toHaveBeenCalledWith({ where: { farmerId: undefined } });
  });

  it('should create a PlotOfLandDto with existing cultivation', async () => {
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      polygonData: 'Polygon',
      region: 'Region',
      localPlotOfLandId: 'Local',
      nationalPlotOfLandId: 'National',
      cultivatedWith: 'Arabica',
    };

    jest.spyOn(prisma.plotOfLand, 'create').mockResolvedValue(PLOT_OF_LAND_TEST_DTO);
    const actualPlotOfLandDto = await service.createPlotOfLand(givenPlotOfLandCreateDto, '1');

    expect(actualPlotOfLandDto).toEqual(PLOT_OF_LAND_TEST_DTO);

    expect(prisma.plotOfLand.create).toHaveBeenCalledWith({
      data: {
        ...givenPlotOfLandCreateDto,
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
      polygonData: 'Polygon',
      region: 'Region',
      localPlotOfLandId: 'Local',
      nationalPlotOfLandId: 'National',
      cultivatedWith: 'Robusta',
    };

    jest.spyOn(prisma.cultivation, 'findFirst').mockResolvedValue(undefined);
    jest.spyOn(prisma.cultivation, 'create').mockResolvedValue({ id: '2', type: 'coffee', sort: 'robusta' });
    jest.spyOn(prisma.plotOfLand, 'create').mockResolvedValue(PLOT_OF_LAND_TEST_DTO);
    const actualPlotOfLandDto = await service.createPlotOfLand(givenPlotOfLandCreateDto, '1');

    expect(actualPlotOfLandDto).toEqual(PLOT_OF_LAND_TEST_DTO);

    expect(prisma.plotOfLand.create).toHaveBeenCalledWith({
      data: {
        ...givenPlotOfLandCreateDto,
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

  it('should update a PlotOfLandDto', async () => {
    const givenPlotOfLandUpdateDto = {
      cultivatedWith: '1',
    };

    jest.spyOn(prisma.plotOfLand, 'update').mockResolvedValue(PLOT_OF_LAND_TEST_DTO);
    const actualPlotOfLandDto = await service.updatePlotOfLand('1', givenPlotOfLandUpdateDto);

    expect(actualPlotOfLandDto).toEqual(PLOT_OF_LAND_TEST_DTO);

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
    jest.spyOn(prisma.plotOfLand, 'delete').mockResolvedValue(PLOT_OF_LAND_TEST_DTO);
    const actualPlotOfLandDto = await service.deletePlotOfLand('1');

    expect(actualPlotOfLandDto).toEqual(PLOT_OF_LAND_TEST_DTO);

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
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      polygonData: 'Polygon',
      region: 'Region',
      cultivatedWith: 'Arabica',
    };

    jest.spyOn(prisma.cultivation, 'findFirst').mockResolvedValue({ id: '1', type: 'coffee', sort: 'arabica' });
    await expect(service.createPlotOfLand(givenPlotOfLandCreateDto, '1')).resolves.toEqual(undefined);
  });

  it('should throw an error when trying to update a PlotOfLandDto with missing data', async () => {
    const givenPlotOfLandUpdateDto = {};

    await expect(service.updatePlotOfLand('1', givenPlotOfLandUpdateDto)).resolves.toEqual(undefined);
  });

  it('should throw an error when trying to create a PlotOfLandDto with invalid data', async () => {
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      polygonData: 'Polygon',
      region: 'Region',
      localPlotOfLandId: 'Local',
      nationalPlotOfLandId: 'National',
      cultivatedWith: '1',
    };

    jest.spyOn(prisma.cultivation, 'findFirst').mockResolvedValue({ id: '1', type: 'coffee', sort: 'arabica' });
    await expect(service.createPlotOfLand(givenPlotOfLandCreateDto, '1')).resolves.toEqual(undefined);
  });

  it('should throw an error when trying to update a PlotOfLandDto with invalid data', async () => {
    const givenPlotOfLandUpdateDto = {
      cultivatedWith: '1',
      description: 'Description',
    };

    await expect(service.updatePlotOfLand('1', givenPlotOfLandUpdateDto)).resolves.toEqual(undefined);
  });

  it('should throw an error when trying to create a PlotOfLandDto with undefined cultivatedWith', async () => {
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      polygonData: 'Polygon',
      region: 'Region',
      localPlotOfLandId: 'Local',
      nationalPlotOfLandId: 'National',
      cultivatedWith: undefined,
    };

    const expectedException = RpcException;
    await expect(service.createPlotOfLand(givenPlotOfLandCreateDto, '1')).rejects.toThrow(expectedException);
  });
});
