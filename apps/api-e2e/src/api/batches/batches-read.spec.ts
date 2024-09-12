import axios from 'axios';
import { beforeEachAndAfterAll, createHttpHeader, HttpHeader, prisma } from '../test-utils/test.utils';
import { ensureBatch, batchNotFoundMessage } from '../assertions/batches/assertion.utils';
import { prepareBatchCreation } from '../test-utils/batches/batches.spec.utils';
import { ensureException } from '../assertions/assertion.utils';

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

