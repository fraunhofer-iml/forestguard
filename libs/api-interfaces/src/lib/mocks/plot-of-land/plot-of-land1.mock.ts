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
