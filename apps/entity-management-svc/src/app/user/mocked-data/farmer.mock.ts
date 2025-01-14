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

import { Address, User } from '@prisma/client';

const FARMER_PRISMA_MOCK: User & { address: Address } = {
  id: 'ctest102',
  firstName: 'Guillermo',
  lastName: 'McFarland',
  email: 'user@example.com',
  mobilePhoneNumber: '+5114841701',
  role: 'FARMER',
  employeeId: 'EID23456789',
  entityId: 'ctest102',
  companyId: 'c1c1f27f-75c9-45f8-98f6-cff1357561e1',
  addressId: null,
  address: null,
  personalId: 'pf1',
};

export { FARMER_PRISMA_MOCK };
