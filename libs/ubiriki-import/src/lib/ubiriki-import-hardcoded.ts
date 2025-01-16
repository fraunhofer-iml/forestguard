/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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


