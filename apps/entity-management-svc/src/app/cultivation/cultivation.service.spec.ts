/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
            getEntityManagementConfiguration: jest.fn().mockReturnValue({ cultivationCommodity: 'coffee' }),
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
      const givenQuality = 'Ecol';

      const expectedCultivation: CultivationDto = { id: '1', commodity: 'coffee', sort: givenSort, quality: givenQuality };
      jest.spyOn(prismaService.cultivation, 'create').mockResolvedValue(expectedCultivation);

      const actualCultivation = await cultivationService.createCultivation({ sort: givenSort, quality: givenQuality });

      expect(actualCultivation).toEqual(expectedCultivation);
      expect(prismaService.cultivation.create).toHaveBeenCalledWith({
        data: { commodity: 'coffee', sort: givenSort, quality: givenQuality },
      });
    });
  });

  describe('readCultivationsByCommodity', () => {
    it('should return an array of CultivationDto', async () => {
      const givenType = 'coffee';
      const expectedCultivations: CultivationDto[] = [
        { id: '1', commodity: givenType, sort: 'Arabica', quality: 'Ecol' },
        { id: '2', commodity: givenType, sort: 'Robusta', quality: 'Ecol' },
      ];
      jest.spyOn(prismaService.cultivation, 'findMany').mockResolvedValue(expectedCultivations);

      const result = await cultivationService.readCultivationsByCommodity(givenType);

      expect(result).toEqual(expectedCultivations);
      expect(prismaService.cultivation.findMany).toHaveBeenCalledWith({
        where: { commodity: givenType },
      });
    });
  });
});
