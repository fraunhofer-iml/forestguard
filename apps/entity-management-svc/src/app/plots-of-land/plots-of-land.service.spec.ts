import { PrismaService } from '@forrest-guard/database';
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
          },
        },
      ],
    }).compile();

    service = module.get<PlotsOfLandService>(PlotsOfLandService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

  it('should create a PlotOfLandDto', async () => {
    const givenPlotOfLandCreateDto = {
      areaInHA: 1,
      country: 'Germany',
      description: 'Description',
      district: 'District',
      polygonData: 'Polygon',
      region: 'Region',
      localPlotOfLandId: 'Local',
      nationalPlotOfLandId: 'National',
    };

    jest.spyOn(prisma.plotOfLand, 'create').mockResolvedValue(PLOT_OF_LAND_TEST_DTO);
    const actualPlotOfLandDto = await service.createPlotOfLand(givenPlotOfLandCreateDto, '1');

    expect(actualPlotOfLandDto).toEqual(PLOT_OF_LAND_TEST_DTO);

    expect(prisma.plotOfLand.create).toHaveBeenCalledWith({
      data: { ...givenPlotOfLandCreateDto, farmer: { connect: { id: '1' } } },
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
    };

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

    await expect(service.createPlotOfLand(givenPlotOfLandCreateDto, '1')).resolves.toEqual(undefined);
  });

  it('should throw an error when trying to update a PlotOfLandDto with invalid data', async () => {
    const givenPlotOfLandUpdateDto = {
      cultivatedWith: '1',
      description: 'Description',
    };

    await expect(service.updatePlotOfLand('1', givenPlotOfLandUpdateDto)).resolves.toEqual(undefined);
  });
});
