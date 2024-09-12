import {
  BatchCombinedCreateDto,
  BatchCreateDto,
  ProcessStepWithMultipleHarvestedLandsCreateDto,
} from '@forest-guard/api-interfaces';
import axios from 'axios';
import { createHttpHeader } from '../test.utils';
import { givenBatchCreateDto, givenPlotOfLand, prepareCompany, prepareFarmer, prepareUser } from '../arrange-utils';

export async function prepareBatchCreationWithPlotOfLand(): Promise<BatchCreateDto> {
  const batchCreateDto = await prepareBatchCreation();
  return  preparePlotOfLandCreation(batchCreateDto);
}

export async function prepareBatchCreation(): Promise<BatchCreateDto> {
  const batchCreateDto: BatchCreateDto = structuredClone(givenBatchCreateDto);
  await prepareCompany();
  const userResponse = await prepareUser();
  const farmerResponse = await prepareFarmer();
  batchCreateDto.recipient = farmerResponse.data.id;
  batchCreateDto.processStep.recordedBy = userResponse.data.id;
  batchCreateDto.processStep.executedBy = farmerResponse.data.id;
  return batchCreateDto;
}

export async function preparePlotOfLandCreation(batchCreateDto: BatchCreateDto): Promise<BatchCreateDto> {
  const plotOfLandResponse = await axios.post(`/pols?farmerId=${batchCreateDto.recipient}`, givenPlotOfLand, await createHttpHeader());
  batchCreateDto.processStep.harvestedLand = plotOfLandResponse.data.id;
  return batchCreateDto;
}

export async function prepareXPlotOfLandsCreation(batchCreateDto: BatchCreateDto, x: number): Promise<BatchCombinedCreateDto> {
  const batchCombinedCreateDto = new BatchCombinedCreateDto(
    batchCreateDto.weight,
    batchCreateDto.recipient,
    new ProcessStepWithMultipleHarvestedLandsCreateDto(
      batchCreateDto.processStep.location,
      batchCreateDto.processStep.date,
      batchCreateDto.processStep.executedBy,
      [],
      batchCreateDto.processStep.recordedBy
    ),
    batchCreateDto.idEUInfoSystem
  );
  if (x !== 0) {
    const plotOfLandResponse = await axios.post(`/pols?farmerId=${batchCreateDto.recipient}`, givenPlotOfLand, await createHttpHeader());
    batchCombinedCreateDto.processStep.harvestedLands = new Array(x).fill(plotOfLandResponse.data.id);
  }
  return batchCombinedCreateDto;
}

export async function prepareTwoPlotOfLandsCreation(batchCreateDto: BatchCreateDto): Promise<BatchCombinedCreateDto> {
  return prepareXPlotOfLandsCreation(batchCreateDto, 2);
}

export async function getBatchesFromDb(recipient: string) {
  return (await axios.get(`/companies/${recipient}/batches`, await createHttpHeader())).data;
}
