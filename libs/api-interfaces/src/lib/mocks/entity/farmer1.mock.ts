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

import { UserOrFarmerDto } from '../../dtos';
import { address1Mock } from '../address';
import { plotOfLand1Mock } from '../plot-of-land';

export const farmer1Mock: UserOrFarmerDto = {
  id: 'ctest102',
  employeeId: 'f1',
  firstName: 'Guillermo',
  lastName: 'McFarland',
  email: 'user@example.com',
  role: 'FARMER',
  mobilePhoneNumber: '+5114841701',
  personalId: 'pf1',
  address: address1Mock,
  plotsOfLand: [plotOfLand1Mock],
};
