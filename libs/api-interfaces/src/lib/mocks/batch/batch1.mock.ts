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

import { BatchDto } from '../../dtos';
import { user1Mock } from '../entity';
import { processStep1Mock } from '../process';

export const batch1Mock: BatchDto = {
  id: '8918e6b7-e288-4f95-bc87-9d8530e66ad1',
  euInfoSystemId: 'EU Info',
  weight: 0,
  active: true,
  recipient: user1Mock,
  processStep: processStep1Mock,
};
