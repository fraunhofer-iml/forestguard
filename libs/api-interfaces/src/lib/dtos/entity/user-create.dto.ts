/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export enum RoleType {
  FARMER = 'FARMER',
  EMPLOYEE = 'EMPLOYEE',
}

export class UserCreateDto {
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobilePhoneNumber?: string;
  role?: RoleType;

  constructor(firstName?: string, lastName?: string, email?: string, employeeId?: string, mobilePhoneNumber?: string, role?: RoleType) {
    this.employeeId = employeeId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.role = role;
  }
}
