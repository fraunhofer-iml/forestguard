/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserCreateDto } from '@forest-guard/api-interfaces';

export function createVariantOf(givenUser: UserCreateDto, firstName = 'Manuel'): UserCreateDto {
  const userVariant = structuredClone(givenUser);
  userVariant.firstName = firstName;
  userVariant.employeeId = crypto.randomUUID();
  return userVariant;
}
