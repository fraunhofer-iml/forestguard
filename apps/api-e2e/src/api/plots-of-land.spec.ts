/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CoordinateType,
  CultivationCreateDto,
  PlotOfLandCreateDto,
  PlotOfLandUpdateDto,
  RoleType,
  Standard,
} from '@forest-guard/api-interfaces';
import axios from 'axios';
import { beforeEachAndAfterAll, createHttpHeader, HttpHeader } from './test-utils/test.utils';

describe('/pols', () => {
  let httpHeader: HttpHeader;

  const givenPlotOfLandCreateDto: PlotOfLandCreateDto = {
    country: 'Peru',
    region: 'Ucayali',
    province: 'A',
    district: 'Coronel Portillo',
    nationalPlotOfLandId: 'n1',
    localPlotOfLandId: 'l1',
    description: 'Lorem ipsum dolor sit amet.',
    geoData: {
      standard: Standard.WGS,
      coordinateType: CoordinateType.Point,
      coordinates: [1],
      zone: '',
    },
    areaInHA: 1,
    cultivationSort: 'arabica',
    cultivationQuality: 'Ecol',
  };

  const companyCreate = {
    name: 'Acme Corp',
    address: {
      street: '123 Elm Street',
      postalCode: '54321',
      city: 'Springfield',
      state: 'IL',
      country: 'USA',
      additionalInformation: 'good t know',
    },
  };

  const userCreate = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@acme.com',
    mobilePhoneNumber: '555-987-6543',
    role: RoleType.EMPLOYEE,
    employeeId: 'EID12345678',
  };

  const farmerCreate = {
    firstName: 'Guillermo',
    lastName: 'McFarland',
    email: 'user@example.com',
    mobilePhoneNumber: '+5114841701',
    role: RoleType.FARMER,
    employeeId: 'f1',
    personalId: 'pf1',
    address: {
      street: '123 Elm Street',
      postalCode: '54321',
      city: 'Springfield',
      state: 'IL',
      country: 'USA',
      additionalInformation: 'good t know',
    },
  };

  beforeAll(async () => {
    httpHeader = await createHttpHeader();
  });

  beforeEachAndAfterAll();

  describe('POST /pols?farmerId', () => {
    it('should create a plot of land', async () => {
      await axios.post(`/companies`, companyCreate, httpHeader);
      await axios.post(`/users`, userCreate, httpHeader);
      const farmer = await axios.post(`/users/farmers`, farmerCreate, httpHeader);

      const actualResponse = await axios.post(`/pols?farmerId=${farmer.data.id}`, givenPlotOfLandCreateDto, httpHeader);

      const expectedResponse = {
        id: actualResponse.data.id,
        country: givenPlotOfLandCreateDto.country,
        region: givenPlotOfLandCreateDto.region,
        province: givenPlotOfLandCreateDto.province,
        district: givenPlotOfLandCreateDto.district,
        nationalPlotOfLandId: givenPlotOfLandCreateDto.nationalPlotOfLandId,
        localPlotOfLandId: givenPlotOfLandCreateDto.localPlotOfLandId,
        description: givenPlotOfLandCreateDto.description,
        geoData: actualResponse.data.geoData,
        areaInHA: givenPlotOfLandCreateDto.areaInHA,
        cultivationId: actualResponse.data.cultivationId,
        farmerId: actualResponse.data.farmerId,
      };

      expect(actualResponse.status).toBe(201);
      expect(actualResponse.data).toEqual(expectedResponse);
    });

    it('should throw an exception for missing cultivatedWith', async () => {
      const errorPlotOfLandCreateDto = structuredClone(givenPlotOfLandCreateDto);
      errorPlotOfLandCreateDto.cultivationSort = null;

      await axios.post(`/companies`, companyCreate, httpHeader);

      await axios.post(`/users`, userCreate, httpHeader);

      const farmer = await axios.post(`/users/farmers`, farmerCreate, httpHeader);

      await expect(axios.post(`/pols?farmerId=${farmer.data.id}`, errorPlotOfLandCreateDto, httpHeader)).rejects.toMatchObject({
        response: {
          data: {
            timestamp: expect.any(String),
            status: 400,
            message: 'Sort of Cultivation is required',
            requestDetails: expect.anything(),
          },
        },
      });
    });

    it('should throw an exception for missing geoData', async () => {
      const errorPlotOfLandCreateDto = structuredClone(givenPlotOfLandCreateDto);
      errorPlotOfLandCreateDto.geoData = null;
      await axios.post(`/companies`, companyCreate, httpHeader);
      await axios.post(`/users`, userCreate, httpHeader);
      const farmer = await axios.post(`/users/farmers`, farmerCreate, httpHeader);

      await expect(axios.post(`/pols?farmerId=${farmer.data.id}`, errorPlotOfLandCreateDto, httpHeader)).rejects.toMatchObject({
        response: {
          data: {
            timestamp: expect.any(String),
            status: 400,
            message: 'GeoData is required',
            requestDetails: expect.anything(),
          },
        },
      });
    });

    it('should throw an exception for missing farmer', async () => {
      await axios.post(`/companies`, companyCreate, httpHeader);
      await axios.post(`/users`, userCreate, httpHeader);

      await expect(axios.post(`/pols?farmerId=unknownFarmerId`, givenPlotOfLandCreateDto, httpHeader)).rejects.toMatchObject({
        response: {
          data: {
            timestamp: expect.any(String),
            status: 401,
            message: 'Unauthorized',
            requestDetails: expect.anything(),
          },
        },
      });
    });
  });

  describe('GET /plots-of-land?farmerId', () => {
    it('should read one plotOfLand', async () => {
      await axios.post(`/companies`, companyCreate, httpHeader);
      await axios.post(`/users`, userCreate, httpHeader);
      const farmer = await axios.post(`/users/farmers`, farmerCreate, httpHeader);

      const expectedElement = await axios.post(`/pols?farmerId=${farmer.data.id}`, givenPlotOfLandCreateDto, httpHeader);

      const actualResponse = await axios.get(`/pols`, httpHeader);
      const expectedResponse = [expectedElement.data];
      expect(actualResponse.data).toEqual(expectedResponse);
    });

    it('should map the right farmer to the right pols', async () => {
      await axios.post(`/companies`, companyCreate, httpHeader);
      await axios.post(`/users`, userCreate, httpHeader);
      const farmer1 = await axios.post(`/users/farmers`, farmerCreate, httpHeader);

      const actualPostResponse1 = await axios.post(`/pols?farmerId=${farmer1.data.id}`, givenPlotOfLandCreateDto, httpHeader);

      const farmerCreate2 = structuredClone(farmerCreate);
      farmerCreate2.lastName = 'Johnson';
      farmerCreate2.employeeId = crypto.randomUUID();
      farmerCreate2.personalId = 'pf2';
      const farmer2 = await axios.post(`/users/farmers`, farmerCreate2, httpHeader);
      const actualPostResponse2 = await axios.post(`/pols?farmerId=${farmer2.data.id}`, givenPlotOfLandCreateDto, httpHeader);

      const actualResponse1 = await axios.get(`/pols?farmerId=${farmer1.data.id}`, httpHeader);
      const expectedResponse1 = [actualPostResponse1.data];
      expect(actualResponse1.data).toEqual(expectedResponse1);

      const actualResponse2 = await axios.get(`/pols?farmerId=${farmer2.data.id}`, httpHeader);
      const expectedResponse2 = [actualPostResponse2.data];
      expect(actualResponse2.data).toEqual(expectedResponse2);
    });
  });

  describe('GET /plots-of-land/id', () => {
    it('should read a plotOfLand by Id', async () => {
      await axios.post(`/companies`, companyCreate, httpHeader);
      await axios.post(`/users`, userCreate, httpHeader);
      const farmer = await axios.post(`/users/farmers`, farmerCreate, httpHeader);

      const postResult = await axios.post(`/pols?farmerId=${farmer.data.id}`, givenPlotOfLandCreateDto, httpHeader);
      const expectedResponse = [postResult.data];
      const actualResponse = await axios.get(`/pols?id=${postResult.data.id}`, httpHeader);
      expect(actualResponse.data).toEqual(expectedResponse);
    });
  });

  describe('PATCH /plots-of-land/id', () => {
    it('should update a plotOfLand', async () => {
      const cultivationCreate: CultivationCreateDto = new CultivationCreateDto('mocca', 'Ecol');
      await axios.post(`/companies`, companyCreate, httpHeader);
      await axios.post(`/users`, userCreate, httpHeader);
      const farmer = await axios.post(`/users/farmers`, farmerCreate, httpHeader);

      const updateCultivation = await axios.post(`/cultivations`, cultivationCreate, httpHeader);

      const postResponse = await axios.post(`/pols?farmerId=${farmer.data.id}`, givenPlotOfLandCreateDto, httpHeader);

      const givenUpdateDto: PlotOfLandUpdateDto = new PlotOfLandUpdateDto(updateCultivation.data.id);
      const actualResponse = await axios.patch(`/pols/${postResponse.data.id}`, givenUpdateDto, httpHeader);
      const expectedResponse = {
        id: actualResponse.data.id,
        country: givenPlotOfLandCreateDto.country,
        province: givenPlotOfLandCreateDto.province,
        region: givenPlotOfLandCreateDto.region,
        district: givenPlotOfLandCreateDto.district,
        nationalPlotOfLandId: givenPlotOfLandCreateDto.nationalPlotOfLandId,
        localPlotOfLandId: givenPlotOfLandCreateDto.localPlotOfLandId,
        description: givenPlotOfLandCreateDto.description,
        geoData: actualResponse.data.geoData,
        areaInHA: givenPlotOfLandCreateDto.areaInHA,
        cultivationId: actualResponse.data.cultivationId,
        farmerId: actualResponse.data.farmerId,
      };

      expect(actualResponse.data).toEqual(expectedResponse);
    });
  });
});
