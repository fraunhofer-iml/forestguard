/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlotOfLandDto } from '../../dtos';
import { cultivation1Mock } from './cultivation1.mock';
import { proof1Mock } from './proof1.mock';

export const plotOfLand1Mock: PlotOfLandDto = {
  id: '53252ae9-fb8e-4a19-8f03-ed6ed5977501',
  country: 'Peru',
  region: 'Ucayali',
  district: 'Coronel Portillo',
  nationalPlotOfLandId: 'n1',
  localPlotOfLandId: 'l1',
  description: 'Lorem ipsum dolor sit amet.',
  geoData: '[{ lat: -32.364, lng: 153.207 }]',
  areaInHA: 1,
  cultivatedWith: cultivation1Mock,
  proofs: [proof1Mock]
}
