import { CultivationDto } from '@forest-guard/api-interfaces';
import { ConfigurationService } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { Test, TestingModule } from '@nestjs/testing';
import { CultivationService } from './cultivation.service';

describe('CultivationService', () => {
  let cultivationService: CultivationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CultivationService,
        {
          provide: PrismaService,
          useValue: {
            cultivation: {
              findMany: jest.fn(),
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

    cultivationService = module.get<CultivationService>(CultivationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCultivation', () => {
    it('should return a CultivationDto', async () => {
      const givenSort = 'Arabica';

      const expectedCultivation: CultivationDto = { id: '1', type: 'coffee', sort: givenSort };
      jest.spyOn(prismaService.cultivation, 'create').mockResolvedValue(expectedCultivation);

      const actualCultivation = await cultivationService.createCultivation({ sort: givenSort });

      expect(actualCultivation).toEqual(expectedCultivation);
      expect(prismaService.cultivation.create).toHaveBeenCalledWith({
        data: { type: 'coffee', sort: givenSort },
      });
    });
  });

  describe('readCultivationsByType', () => {
    it('should return an array of CultivationDto', async () => {
      const givenType = 'coffee';
      const expectedCultivations: CultivationDto[] = [
        { id: '1', type: givenType, sort: 'Arabica' },
        { id: '2', type: givenType, sort: 'Robusta' },
      ];
      jest.spyOn(prismaService.cultivation, 'findMany').mockResolvedValue(expectedCultivations);

      const result = await cultivationService.readCultivationsByType(givenType);

      expect(result).toEqual(expectedCultivations);
      expect(prismaService.cultivation.findMany).toHaveBeenCalledWith({
        where: { type: givenType },
      });
    });
  });
});
