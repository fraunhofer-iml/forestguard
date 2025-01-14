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

import { User } from '@prisma/client';

const USER_PRISMA_MOCK: User = {
  id: 'ctest101',
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@acme.com',
  mobilePhoneNumber: '555-987-6543',
  role: 'EMPLOYEE',
  employeeId: 'EID12345678',
  entityId: 'ctest101',
  companyId: 'c1c1f27f-75c9-45f8-98f6-cff1357561e1',
  addressId: null,
  personalId: null,
};

export { USER_PRISMA_MOCK };
