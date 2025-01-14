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
import { ensureException } from './assertions/assertion.utils';
import { batchNotFoundMessage, ensureBatch } from './assertions/batches/assertion.utils';
import { prepareBatchCreation } from './test-utils/batches.spec.utils';
import { beforeEachAndAfterAll, createHttpHeader, HttpHeader, prisma } from './test-utils/test.utils';

describe('/batches-read', () => {
  let httpHeader: HttpHeader;

  beforeAll(async () => {
    httpHeader = await createHttpHeader();
  });

  beforeEachAndAfterAll();

  describe('GET /batches/:id', () => {
    it('should get a batch', async () => {
      const batchCreateDto = await prepareBatchCreation();
      await axios.post(`/batches`, [batchCreateDto], httpHeader);
      const batches = await prisma.batch.findMany();

      const response = await axios.get(`/batches/${batches[0].id}`, httpHeader);

      expect(response.status).toBe(200);
      ensureBatch(response.data, batchCreateDto);
    });

    it('should not get a batch because ID does not exist', async () => {
      const givenBatchId = '123';

      try {
        await axios.get(`/batches/${givenBatchId}`, httpHeader);
      } catch (err) {
        ensureException(err, batchNotFoundMessage);
      }
    });
  });
});
