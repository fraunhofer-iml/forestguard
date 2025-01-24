/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CultivationCreateDto, CultivationDto } from '@forest-guard/api-interfaces';
import axios from 'axios';
import { beforeEachAndAfterAll, createHttpHeader, HttpHeader, prisma } from './test-utils/test.utils';

const cultivationCommodity = 'coffee';

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

  describe('GET /cultivations/sorts', () => {
    it('should get two sorts', async () => {
      await axios.post(`/cultivations`, givenCultivationCreateDto, httpHeader);

      const givenCultivationCreateDto2: CultivationCreateDto = {
        sort: 'Robusta',
        quality: 'Ecol',
      };
      await axios.post(`/cultivations`, givenCultivationCreateDto2, httpHeader);

      const actualResponseFromGet = await axios.get('/cultivations/sorts', httpHeader);

      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual([givenCultivationCreateDto.sort, givenCultivationCreateDto2.sort]);
    });

    it('should get zero cultivations', async () => {
      const expectedResponse = [];
      const actualResponseFromGet = await axios.get('/cultivations/sorts', httpHeader);
      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponse);
    });
  });

  describe('GET /cultivations/qualities', () => {
    it('should get filtered qualities', async () => {
      await axios.post(`/cultivations`, givenCultivationCreateDto, httpHeader);

      const givenCultivationCreateDto2: CultivationCreateDto = {
        sort: 'Robusta',
        quality: 'c1',
      };
      await axios.post(`/cultivations`, givenCultivationCreateDto2, httpHeader);

      const actualResponseFromGet = await axios.get('/cultivations/qualities?sort=Robusta', httpHeader);

      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual([givenCultivationCreateDto2.quality]);
    });

    it('should get zero cultivations', async () => {
      const expectedResponse = [];
      const actualResponseFromGet = await axios.get('/cultivations/qualities', httpHeader);
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
