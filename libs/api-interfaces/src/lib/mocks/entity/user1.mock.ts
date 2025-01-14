/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserDto } from '../../dtos';

export const user1Mock: UserDto = {
  id: 'ctest101',
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@acme.com',
  mobilePhoneNumber: '555-987-6543',
  role: 'EMPLOYEE',
  employeeId: 'EID12345678',
};
