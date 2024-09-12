import {
  BatchCreateDto,
  CompanyCreateDto,
  CoordinateType,
  FarmerCreateDto,
  PlotOfLandCreateDto,
  RoleType,
  Standard,
  UserUpdateDto,
} from '@forest-guard/api-interfaces';
import axios from 'axios';
import { createHttpHeader } from './test.utils';

export enum Process {
  HARVESTING = 'Harvesting',
  MERGE = 'Merge'
}

export const givenBatchCreateDto: BatchCreateDto = {
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
export const givenUser: UserUpdateDto = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@acme.com',
  mobilePhoneNumber: '555-987-6543',
  role: RoleType.EMPLOYEE,
  employeeId: 'EID12345678',
};
export const givenFarmer: FarmerCreateDto = {
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
  },
};
export const givenCompanyCreateDto: CompanyCreateDto = {
  name: 'Acme Corp',
  address: {
    street: '123 Elm Street',
    postalCode: '54321',
    city: 'Springfield',
    state: 'IL',
    country: 'USA',
  },
};
export const givenPlotOfLand: PlotOfLandCreateDto = {
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

export async function prepareCompany() {
  return await axios.post(`/companies`, givenCompanyCreateDto, await createHttpHeader());
}

export async function prepareUser() {
  return await axios.post(`/users`, givenUser, await createHttpHeader());
}

export async function prepareFarmer() {
  return await axios.post(`/users/farmers`, givenFarmer, await createHttpHeader());
}
