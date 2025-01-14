/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
