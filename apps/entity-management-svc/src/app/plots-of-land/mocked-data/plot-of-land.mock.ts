/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeoDataDto,Standard,CoordinateType } from '@forest-guard/api-interfaces';
import { PlotOfLand, Role } from '@prisma/client';

const givenUser = {
  id: '1',
  firstName: 'Peter',
  lastName: 'Tester',
  email: '',
  mobilePhoneNumber: '',
  role: Role.FARMER,
  entityId: undefined,
  companyId: undefined,
  employeeId: undefined,
  addressId: undefined,
  personalId: undefined,
};

const givenGeoDataDto = new GeoDataDto(
  Standard.UTM,
  CoordinateType.Polygon,
  [
    [
      [500000, 9000000],
      [600000, 8500000],
    ],
  ],
  '18L'
);

const expectedPlotOfLandDto: PlotOfLand = {
  id: '1',
  areaInHA: 1,
  country: 'Germany',
  description: 'Description',
  district: 'District',
  geoData: undefined, // will be set in beforeEach
  region: 'Region',
  province: 'Province',
  localPlotOfLandId: 'Local',
  nationalPlotOfLandId: 'National',
  cultivationId: '1',
  farmerId: '1',
};

export { givenUser, givenGeoDataDto, expectedPlotOfLandDto };
