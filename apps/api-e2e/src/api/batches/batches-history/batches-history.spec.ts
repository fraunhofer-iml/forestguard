import { beforeEachAndAfterAll, createHttpHeader, HttpHeader } from '../../test.utils';
import axios from 'axios';
import { prepareBatchCreationWithPlotOfLand } from '../batches.spec.utils';
import { batchNotFoundMessage, ensureException } from '../assertion.utils';
import { prepareTree } from './batches-history.spec.utils';
import { ensureExport, ensureRelatedBatches } from './assertion-history.utils';
import { BatchCreateDto } from '@forest-guard/api-interfaces';

describe('/batches', () => {

  let httpHeader: HttpHeader;
  let batchCreateDto: BatchCreateDto;

  beforeAll(async () => {
    httpHeader = await createHttpHeader();
  });

  beforeEachAndAfterAll();

  beforeEach(async () => {
    batchCreateDto = await prepareBatchCreationWithPlotOfLand();
  });

  describe('GET /batches/:id/related', () => {
    it('should return batch with related batches', async () => {
      const { targetBatch, deadEndBatch } = await prepareTree(batchCreateDto);

      const response = await axios.get(`/batches/${targetBatch.id}/related`, httpHeader);

      ensureRelatedBatches(response, targetBatch, deadEndBatch);
    });


    it('should not get a batch because ID does not exist', async () => {
      const givenBatchId = '123';

      try {
        await axios.get(`/batches/${givenBatchId}/related`, httpHeader);
      } catch (err) {
        ensureException(err, batchNotFoundMessage);
      }
    });
  });

  describe('GET /batches/:id/export', () => {
    it('should return export file of the specified batch ', async () => {
      const { targetBatch } = await prepareTree(batchCreateDto);

      const response = await axios.get(`/batches/${targetBatch.id}/export`, httpHeader);

      ensureExport(response, targetBatch);
    });


    it('should not get a batch because ID does not exist', async () => {
      const givenBatchId = '123';

      try {
        await axios.get(`/batches/${givenBatchId}/export`, httpHeader);
      } catch (err) {
        ensureException(err, batchNotFoundMessage);
      }
    });
  });
});

