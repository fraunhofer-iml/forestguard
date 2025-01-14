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

import axios from 'axios';
import { HttpStatus } from '@nestjs/common';
import { ensureException } from './assertions/assertion.utils';
import { ensureFarmer, ensureUser, ensureUsers, userNotFoundMessage } from './assertions/users/assertion.utils';
import { givenFarmer, givenUser, prepareCompany } from './test-utils/arrange-utils';
import { beforeEachAndAfterAll, createHttpHeader, HttpHeader } from './test-utils/test.utils';
import { createVariantOf } from './test-utils/users.spec.utils';

describe('/users', () => {
  let httpHeader: HttpHeader;

  beforeAll(async () => {
    httpHeader = await createHttpHeader();
  });

  beforeEachAndAfterAll();

  beforeEach(async () => {
    await prepareCompany();
  });

  describe('POST /users', () => {
    it('should create an user', async () => {
      const actualResponse = await axios.post(`/users`, givenUser, httpHeader);

      expect(actualResponse.status).toBe(HttpStatus.CREATED);
      ensureUser(actualResponse.data, givenUser);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update an user', async () => {
      const createdFarmer = (await axios.post(`/users/farmers`, givenFarmer, httpHeader)).data;
      createdFarmer.firstName = 'alteredName';
      createdFarmer.address.street = 'alteredStreet';

      const actualResponse = await axios.patch(`/users/${createdFarmer.id}`, createdFarmer, httpHeader);

      expect(actualResponse.status).toBe(HttpStatus.OK);
      ensureFarmer(actualResponse.data, createdFarmer);
    });
  });

  describe('GET /users', () => {
    it('should get all users', async () => {
      const givenUser2 = createVariantOf(givenUser);
      await axios.post(`/users`, givenUser, httpHeader);
      await axios.post(`/users`, givenUser2, httpHeader);

      const actualResponse = await axios.get(`/users`, httpHeader);

      expect(actualResponse.status).toBe(HttpStatus.OK);
      ensureUsers(actualResponse.data, givenUser, givenUser2);
    });
  });

  describe('GET /users/:id', () => {
    it('should get one user by ID', async () => {
      const givenUser2 = createVariantOf(givenUser);
      const createdUser1 = await axios.post(`/users`, givenUser, httpHeader);
      const createdUser2 = await axios.post(`/users`, givenUser2, httpHeader);

      let actualResponse = await axios.get(`/users/${createdUser1.data.id}`, httpHeader);

      expect(actualResponse.status).toBe(HttpStatus.OK);
      ensureUser(actualResponse.data, givenUser);

      actualResponse = await axios.get(`/users/${createdUser2.data.id}`, httpHeader);

      expect(actualResponse.status).toBe(HttpStatus.OK);
      ensureUser(actualResponse.data, givenUser2);
    });

    it('should not get an user because id does not exist', async () => {
      const givenUserId = '123';

      try {
        await axios.get(`/users/${givenUserId}`, httpHeader);
      } catch (err) {
        ensureException(err, userNotFoundMessage);
      }
    });
  });

  describe('POST /users/farmers', () => {
    it('should create a farmer', async () => {
      const actualResponse = await axios.post(`/users/farmers`, givenFarmer, httpHeader);

      expect(actualResponse.status).toBe(HttpStatus.CREATED);
      ensureFarmer(actualResponse.data, givenFarmer);
    });
  });
});
