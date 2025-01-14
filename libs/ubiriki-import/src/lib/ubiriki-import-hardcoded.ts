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

import { AddressCreateDto, RoleType, UserCreateDto } from "@forest-guard/api-interfaces";

export const COMPANY_IDENTIFIER = process.env['UBIRIKI_IMPORT_IDENTIFIER'] || 'Acme Corp';

export const ENTRY_SHEET_INDEX = 1;

export const TOTAL_XLSX_SHEETS = 5;

export const XlsxColumn = {
  employeeId: 1,
  name: 2,
  personalId: 3,
  description: 4,
  zone: 5,
  xCoordinate: 6,
  yCoordinate: 7,
  areaInHA: 9,
  cultivationQuality: 28,
};

export const Address: AddressCreateDto = {
  street: 'Carretera Marginal Km.61',
  postalCode: '',
  city: 'Pichanaki',
  state: 'Junin',
  country: 'Peru',
  additionalInformation: '',
};

export const HardcodedPlotsOfLandData = {
  country: 'Peru',
  region: 'Junín',
  province: 'Chanchamayo',
  district: 'Pichanaki',
  nationalPlotOfLandId: '',
  address: Address,
  cultivationSort: 'Arabica',
};

export const HardcodedEmployee: UserCreateDto = {
    firstName: '',
    lastName: 'Cesar Maquera',
    email: '',
    mobilePhoneNumber: '',
    role: RoleType.EMPLOYEE,
}


