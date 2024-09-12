import { beforeEachAndAfterAll, createHttpHeader, HttpHeader } from '../../test-utils/test.utils';
import axios from 'axios';
import { prepareBatchCreationWithPlotOfLand } from '../../test-utils/batches/batches.spec.utils';
import { batchNotFoundMessage } from '../../assertions/batches/assertion.utils';
import { prepareTree } from '../../test-utils/batches/batches-history/batches-history.spec.utils';
import { ensureExport, ensureRelatedBatches } from '../../assertions/batches/batches-history/assertion-history.utils';
import { BatchCreateDto } from '@forest-guard/api-interfaces';
import { ensureException } from '../../assertions/assertion.utils';

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

