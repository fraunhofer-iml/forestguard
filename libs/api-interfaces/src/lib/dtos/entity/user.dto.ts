/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export class UserDto {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  mobilePhoneNumber: string;

  constructor(id: string, employeeId: string, firstName: string, lastName: string, email: string, role: string, mobilePhoneNumber: string) {
    this.id = id;
    this.employeeId = employeeId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.role = role;
    this.mobilePhoneNumber = mobilePhoneNumber;
  }
}
