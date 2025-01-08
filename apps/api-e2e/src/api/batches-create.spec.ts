import { BatchCreateDto } from '@forest-guard/api-interfaces';
import axios from 'axios';
import { HttpStatus } from '@nestjs/common';
import { ensureResponseBatch, ensureResponseBatchWithProcess } from './assertions/batches/assertion.utils';
import { givenFarmer, prepareFarmerWithDto, preparePlotOfLand, Process } from './test-utils/arrange-utils';
import {
  prepareBatchCreationWithPlotOfLand,
  prepareTwoPlotsOfLandCreation,
  prepareXPlotsOfLandCreation,
} from './test-utils/batches.spec.utils';
import { beforeEachAndAfterAll, createHttpHeader, HttpHeader } from './test-utils/test.utils';

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

    it('should throw error if PlotsOfLand come from different farmers', async () => {
      const givenBatchCombinedCreateDto = await prepareXPlotsOfLandCreation(batchCreateDto, 0);
      const plotOfLand1 = await preparePlotOfLand(batchCreateDto.processStep.executedBy);
      const farmerDto = structuredClone(givenFarmer);
      farmerDto.employeeId = crypto.randomUUID();
      farmerDto.personalId = 'pf2';
      const farmer2 = await prepareFarmerWithDto(farmerDto);
      const plotOfLand2 = await preparePlotOfLand(farmer2.data.id);
      givenBatchCombinedCreateDto.processStep.harvestedLands = [plotOfLand1.data.id, plotOfLand2.data.id];

      try {
        await axios.post(`/batches/harvests/combined`, givenBatchCombinedCreateDto, httpHeader);
      } catch (err) {
        expect(err.response.data.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
