/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AddressCreateDto } from './address-create.dto';
import { UserCreateDto } from './user-create.dto';

export class FarmerCreateDto extends UserCreateDto {
  personalId: string;
  address: AddressCreateDto;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    employeeId: string,
    personalId: string,
    mobilePhoneNumber: string,
    address: AddressCreateDto
  ) {
    super(firstName, lastName, email, employeeId, mobilePhoneNumber);
    this.personalId = personalId;
    this.address = address;
  }
}
