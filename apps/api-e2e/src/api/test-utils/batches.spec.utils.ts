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

import { BatchCombinedCreateDto, BatchCreateDto, ProcessStepWithMultipleHarvestedLandsCreateDto } from '@forest-guard/api-interfaces';
import axios from 'axios';
import { givenBatchCreateDto, givenPlotOfLand, prepareCompany, prepareFarmer, prepareUser } from './arrange-utils';
import { createHttpHeader } from './test.utils';

// We need to wait until a PlotOfLand NFT is fully minted. Unfortunately, this can take some time on a local machine.
async function waitForMinting() {
  if (process.env['BLOCKCHAIN_ENABLED'] === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

export async function prepareBatchCreationWithPlotOfLand(): Promise<BatchCreateDto> {
  const batchCreateDto = await prepareBatchCreation();
  return preparePlotOfLandCreation(batchCreateDto);
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
  const plotOfLandResponse = await axios.post(`/pols?farmerId=${batchCreateDto.processStep.executedBy}`, givenPlotOfLand, await createHttpHeader());
  batchCreateDto.processStep.harvestedLand = plotOfLandResponse.data.id;

  await waitForMinting();
  return batchCreateDto;
}

export async function prepareXPlotsOfLandCreation(batchCreateDto: BatchCreateDto, x: number): Promise<BatchCombinedCreateDto> {
  const batchCombinedCreateDto = new BatchCombinedCreateDto(
    batchCreateDto.weight,
    batchCreateDto.recipient,
    new ProcessStepWithMultipleHarvestedLandsCreateDto(
      batchCreateDto.processStep.location,
      batchCreateDto.processStep.dateOfProcess,
      batchCreateDto.processStep.executedBy,
      [],
      batchCreateDto.processStep.recordedBy
    ),
    batchCreateDto.euInfoSystemId
  );
  if (x !== 0) {
    const plotOfLandResponse = await axios.post(`/pols?farmerId=${batchCreateDto.processStep.executedBy}`, givenPlotOfLand, await createHttpHeader());
    batchCombinedCreateDto.processStep.harvestedLands = new Array(x).fill(plotOfLandResponse.data.id);

    await waitForMinting();
  }

  return batchCombinedCreateDto;
}

export async function prepareTwoPlotsOfLandCreation(batchCreateDto: BatchCreateDto): Promise<BatchCombinedCreateDto> {
  return prepareXPlotsOfLandCreation(batchCreateDto, 2);
}

export async function getBatchesFromDb(recipient: string) {
  return (await axios.get(`/companies/${recipient}/batches`, await createHttpHeader())).data;
}
