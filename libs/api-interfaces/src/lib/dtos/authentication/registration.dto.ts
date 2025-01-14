/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export class RegistrationDto {
  email: string;
  password: string;
  role?: string;
  firstName?: string;
  lastName?: string;

  constructor(email: string, password: string, role?: string, firstName?: string, lastName?: string) {
    this.email = email;
    this.password = password;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
