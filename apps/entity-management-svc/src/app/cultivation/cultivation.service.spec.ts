import { CultivationDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
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
            },
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
