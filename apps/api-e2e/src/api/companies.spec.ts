/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyCreateDto, CompanyDto, FarmerCreateDto, RoleType } from '@forest-guard/api-interfaces';
import axios from 'axios';
import { beforeEachAndAfterAll, createHttpHeader, HttpHeader, prisma } from './test-utils/test.utils';

describe('/companies', () => {
  let httpHeader: HttpHeader;

  const givenCompanyCreateDto: CompanyCreateDto = {
    name: 'Acme Corp',
    address: {
      street: '123 Elm Street',
      postalCode: '54321',
      city: 'Springfield',
      state: 'IL',
      country: 'USA',
      additionalInformation: 'good to know',
    },
  };

  beforeAll(async () => {
    httpHeader = await createHttpHeader();
  });

  beforeEachAndAfterAll();

  describe('POST /companies', () => {
    it('should create a company', async () => {
      const actualResponse = await axios.post(`/companies`, givenCompanyCreateDto, httpHeader);

      const expectedResponse: CompanyDto = {
        id: actualResponse.data.id,
        ...givenCompanyCreateDto,
        address: {
          id: actualResponse.data.address.id,
          ...givenCompanyCreateDto.address,
        },
      };

      expect(actualResponse.status).toBe(201);
      expect(actualResponse.data).toEqual(expectedResponse);
    });

    it('should not create a company because name already exists', async () => {
      await axios.post(`/companies`, givenCompanyCreateDto, httpHeader);

      try {
        await axios.post(`/companies`, givenCompanyCreateDto, httpHeader);
      } catch (err) {
        expect(err.response.data.timestamp).toBeDefined();
        expect(err.response.data.status).toBe(409);
        expect(err.response.data.message).toBe(`Company with name '${givenCompanyCreateDto.name}' already exists.`);
        expect(err.response.data.requestDetails).toBeDefined();
      }
    });
  });

  describe('GET /companies/:id', () => {
    it('should get a company', async () => {
      const actualResponseFromPost = await axios.post(`/companies`, givenCompanyCreateDto, httpHeader);

      const actualResponseFromGet = await axios.get(`/companies/${actualResponseFromPost.data.id}`, httpHeader);

      const expectedResponse: CompanyDto = {
        id: actualResponseFromGet.data.id,
        ...givenCompanyCreateDto,
        employees: [],
        farmers: [],
        address: {
          id: actualResponseFromGet.data.address.id,
          ...givenCompanyCreateDto.address,
        },
      };

      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponse);
    });

    it('should not get a company because id does not exist', async () => {
      const givenCompanyId = '123';

      try {
        await axios.get(`/companies/${givenCompanyId}`, httpHeader);
      } catch (err) {
        expect(err.response.data.timestamp).toBeDefined();
        expect(err.response.data.status).toBe(404);
        expect(err.response.data.message).toBe(`Company with id '${givenCompanyId}' not found.`);
        expect(err.response.data.requestDetails).toBeDefined();
      }
    });
  });

  describe('GET /companies/:id/farmers', () => {
    it('should get one farmer of a specific company', async () => {
      const actualResponseFromPostCompanies = await axios.post(`/companies`, givenCompanyCreateDto, httpHeader);

      const givenFarmerCreateDto: FarmerCreateDto = {
        employeeId: 'e1',
        firstName: 'fn',
        lastName: 'ln',
        email: 'fn.ln@coffee-beans.com',
        mobilePhoneNumber: '555-123456789',
        role: RoleType.FARMER,
        personalId: 'p1',
        address: {
          street: 's1',
          postalCode: 'pc1',
          city: 'c1',
          state: 'S1',
          country: 'C1',
          additionalInformation: 'good to know',
        },
      };

      const actualResponseFromPostFarmers = await axios.post(`/users/farmers`, givenFarmerCreateDto, httpHeader);

      await prisma.user.update({
        where: { id: actualResponseFromPostFarmers.data.id },
        data: {
          companyId: actualResponseFromPostCompanies.data.id,
        },
      });

      const expectedResponse = [
        {
          id: actualResponseFromPostFarmers.data.id,
          employeeId: givenFarmerCreateDto.employeeId,
          firstName: givenFarmerCreateDto.firstName,
          lastName: givenFarmerCreateDto.lastName,
          email: givenFarmerCreateDto.email,
          role: givenFarmerCreateDto.role,
          mobilePhoneNumber: givenFarmerCreateDto.mobilePhoneNumber,
          personalId: givenFarmerCreateDto.personalId,
          address: {
            id: actualResponseFromPostFarmers.data.address.id,
            ...givenFarmerCreateDto.address,
          },
          plotsOfLand: [],
          documents: [],
        },
      ];

      const actualResponseFromGet = await axios.get(`/companies/${actualResponseFromPostCompanies.data.id}/farmers`, httpHeader);
      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponse);
    });
  });
});
