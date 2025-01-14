/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserOrFarmerDto } from '.';
import { AddressDto } from './address.dto';
import { UserDto } from './user.dto';

export class CompanyDto {
  id: string;
  name: string;
  address: AddressDto;
  employees?: UserDto[];
  farmers?: UserOrFarmerDto[];

  constructor(id: string, name: string, address: AddressDto, employees?: UserDto[], farmers?: UserOrFarmerDto[]) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.employees = employees;
    this.farmers = farmers;
  }
}
