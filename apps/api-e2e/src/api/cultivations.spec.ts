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

import { CultivationCreateDto, CultivationDto } from '@forest-guard/api-interfaces';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { beforeEachAndAfterAll, createHttpHeader, HttpHeader, prisma } from './test-utils/test.utils';

dotenv.config();

const cultivationCommodity = process.env.CULTIVATION_COMMODITY;

describe('/cultivations', () => {
  let httpHeader: HttpHeader;

  const givenCultivationCreateDto: CultivationCreateDto = {
    sort: 'Arabica',
    quality: 'Ecol',
  };

  beforeAll(async () => {
    httpHeader = await createHttpHeader();
  });

  beforeEachAndAfterAll();

  afterEach(async () => {
    await prisma.cultivation.deleteMany();
  });

  describe('POST /cultivations', () => {
    it('should create one cultivation', async () => {
      const actualResponse = await axios.post('/cultivations', givenCultivationCreateDto, httpHeader);

      const expectedResponse: CultivationDto = {
        id: actualResponse.data.id,
        commodity: cultivationCommodity,
        sort: givenCultivationCreateDto.sort,
        quality: givenCultivationCreateDto.quality,
      };

      expect(actualResponse.status).toBe(201);
      expect(actualResponse.data).toEqual(expectedResponse);
    });
  });

  describe('GET /cultivations', () => {
    it('should get two cultivations', async () => {
      await axios.post(`/cultivations`, givenCultivationCreateDto, httpHeader);

      const givenCultivationCreateDto2: CultivationCreateDto = {
        sort: 'Robusta',
        quality: 'Ecol',
      };
      await axios.post(`/cultivations`, givenCultivationCreateDto2, httpHeader);

      const actualResponseFromGet = await axios.get('/cultivations', httpHeader);

      const expectedResponseFromGet: CultivationDto[] = [
        {
          id: actualResponseFromGet.data[0].id,
          commodity: cultivationCommodity,
          sort: givenCultivationCreateDto.sort,
          quality: givenCultivationCreateDto.quality,
        },
        {
          id: actualResponseFromGet.data[1].id,
          commodity: cultivationCommodity,
          sort: givenCultivationCreateDto2.sort,
          quality: givenCultivationCreateDto.quality,
        },
      ];

      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponseFromGet);
    });

    it('should get zero cultivations', async () => {
      const expectedResponse = [];
      const actualResponseFromGet = await axios.get('/cultivations', httpHeader);
      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponse);
    });
  });

  describe('GET/cultivations/commodities', () => {
    it('should get the declared commodities', async () => {
      const expectedResponse = [cultivationCommodity];
      const actualResponseFromGet = await axios.get('/cultivations/commodities', httpHeader);
      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponse);
    });
  });
});
