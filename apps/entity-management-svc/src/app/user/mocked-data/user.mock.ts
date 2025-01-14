/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
