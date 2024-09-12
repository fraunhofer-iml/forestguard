import {
  BatchCombinedCreateDto,
  BatchCreateDto, CompanyCreateDto,
  CoordinateType, FarmerCreateDto,
  PlotOfLandCreateDto,
  ProcessStepWithMultipleHarvestedLandsCreateDto,
  RoleType,
  Standard,
  UserUpdateDto,
} from '@forest-guard/api-interfaces';
import axios from 'axios';
import { createHttpHeader } from '../test.utils';

export enum Process {
  HARVESTING = 'Harvesting',
  MERGE = 'Merge'
}

// Marker to identify batches in a complex batch tree
export const marker1 = 'marker1';
export const marker2 = 'marker2';
export const marker3 = 'marker3';

const givenBatchCreateDto: BatchCreateDto = {
  idEUInfoSystem: null,
  ins: [],
  weight: 33,
  recipient: undefined,
  processStep: {
    location: '',
    date: '2024-05-24T08:28:24Z',
    process: Process.HARVESTING,
    recordedBy: undefined,
    executedBy: undefined,
  },
};

const user: UserUpdateDto = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@acme.com',
  mobilePhoneNumber: '555-987-6543',
  role: RoleType.EMPLOYEE,
  employeeId: 'EID12345678',
};

const farmer: FarmerCreateDto = {
  firstName: 'Guillermo',
  lastName: 'McFarland',
  email: 'user@example.com',
  mobilePhoneNumber: '+5114841701',
  role: RoleType.FARMER,
  employeeId: 'f1',
  personalId: 'pf1',
  address: {
    street: '123 Elm Street',
    postalCode: '54321',
    city: 'Springfield',
    state: 'IL',
    country: 'USA',
  }
};

const companyCreateDto: CompanyCreateDto = {
  name: 'Acme Corp',
  address: {
    street: '123 Elm Street',
    postalCode: '54321',
    city: 'Springfield',
    state: 'IL',
    country: 'USA',
  },
};

const plotOfLand: PlotOfLandCreateDto = {
  country: 'Peru',
  region: 'Ucayali',
  district: 'Coronel Portillo',
  nationalPlotOfLandId: 'n1',
  localPlotOfLandId: 'l1',
  description: 'Lorem ipsum dolor sit amet.',
  geoData: {
    standard: Standard.WGS,
    coordinateType: CoordinateType.Point,
    coordinates: [1],
    zone: '',
  },
  areaInHA: 1,
  cultivatedWith: 'arabica',
};

export async function prepareBatchCreationWithPlotOfLand(): Promise<BatchCreateDto> {
  const batchCreateDto = await prepareBatchCreation();
  return  preparePlotOfLandCreation(batchCreateDto);
}

export async function prepareBatchCreation(): Promise<BatchCreateDto> {
  const batchCreateDto: BatchCreateDto = structuredClone(givenBatchCreateDto);
  await axios.post(`/companies`, companyCreateDto, await createHttpHeader());
  const userResponse = await axios.post(`/users`, user, await createHttpHeader());
  const farmerResponse = await axios.post(`/users/farmers`, farmer, await createHttpHeader());
  batchCreateDto.recipient = farmerResponse.data.id;
  batchCreateDto.processStep.recordedBy = userResponse.data.id;
  batchCreateDto.processStep.executedBy = farmerResponse.data.id;
  return batchCreateDto;
}

export async function preparePlotOfLandCreation(batchCreateDto: BatchCreateDto): Promise<BatchCreateDto> {
  const plotOfLandResponse = await axios.post(`/pols?farmerId=${batchCreateDto.recipient}`, plotOfLand, await createHttpHeader());
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
    const plotOfLandResponse = await axios.post(`/pols?farmerId=${batchCreateDto.recipient}`, plotOfLand, await createHttpHeader());
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
