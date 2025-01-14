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

import { CompanyDto } from '../../dtos';
import { address1Mock } from '../address';
import { user1Mock } from './user1.mock';
import { farmer1Mock } from './farmer1.mock';

export const company1Mock: CompanyDto = {
    id: '0de044f0-bc57-495f-94c1-12ddb4fd05a1',
    name: 'Company1',
    address: address1Mock,
    employees: [user1Mock],
    farmers: [farmer1Mock]
}
