import axios from 'axios';
import { beforeEachAndAfterAll, createHttpHeader, HttpHeader } from '../test-utils/test.utils';
import { ensureResponseBatch, ensureResponseBatchWithProcess } from '../assertions/batches/assertion.utils';
import {
  prepareBatchCreationWithPlotOfLand,
  prepareTwoPlotsOfLandCreation,
  prepareXPlotsOfLandCreation,

} from '../test-utils/batches/batches.spec.utils';
import { HttpStatus } from '@nestjs/common';
import { BatchCreateDto } from '@forest-guard/api-interfaces';
import { Process } from '../test-utils/arrange-utils';

describe('/batches-create', () => {

  let httpHeader: HttpHeader;
  let batchCreateDto: BatchCreateDto;

  beforeAll(async () => {
    httpHeader = await createHttpHeader();
  });

  beforeEachAndAfterAll();

  beforeEach(async () => {
    batchCreateDto = await prepareBatchCreationWithPlotOfLand();
  });

  describe('POST /batches', () => {
    it('should create one batch', async () => {
      const response = await axios.post(`/batches`, [batchCreateDto], httpHeader);
      await ensureResponseBatch(response, batchCreateDto, 1);
    });

    it('should create multiple batches', async () => {
      const response = await axios.post(`/batches`, [batchCreateDto, batchCreateDto], httpHeader);
      await ensureResponseBatch(response, batchCreateDto, 2);
    });

    it('should response with no created batches', async () => {
      const response = await axios.post(`/batches`, [], httpHeader);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });
  });

  describe('POST /batches/harvests', () => {
    it('should create one harvest batch', async () => {
      const response = await axios.post(`/batches/harvests`, [batchCreateDto], httpHeader);
      await ensureResponseBatchWithProcess(response, batchCreateDto, 1, Process.HARVESTING);
    });

    it('should create multiple harvest batches and merge', async () => {
      const response = await axios.post(`/batches/harvests`, [batchCreateDto, batchCreateDto], httpHeader);

      batchCreateDto.weight = 2 * batchCreateDto.weight;
      await ensureResponseBatchWithProcess(response, batchCreateDto, 1, Process.MERGE);
    });

    it('should response with no created batches', async () => {
      const response = await axios.post(`/batches`, [], httpHeader);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });
  });

  describe('POST /batches/harvests/combined', () => {
    it('should create combined harvest batches', async () => {
      const givenBatchCombinedCreateDto = await prepareTwoPlotsOfLandCreation(batchCreateDto);

      const response = await axios.post(`/batches/harvests/combined`, givenBatchCombinedCreateDto, httpHeader);

      await ensureResponseBatchWithProcess(response, batchCreateDto, 1, Process.MERGE);
    });

    it('should response with no created batches', async () => {
      const givenBatchCombinedCreateDto = await prepareXPlotsOfLandCreation(batchCreateDto, 0);

      const response = await axios.post(`/batches/harvests/combined`, givenBatchCombinedCreateDto, httpHeader);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });
  });

  // TODO: new e2e test 

});

