/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AddressCreateDto } from './address-create.dto';

export class UserUpdateDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobilePhoneNumber?: string;
  address?: AddressCreateDto;

  constructor(firstName: string, lastName: string, email: string, mobilePhoneNumber: string, address: AddressCreateDto) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.address = address;
  }
}
