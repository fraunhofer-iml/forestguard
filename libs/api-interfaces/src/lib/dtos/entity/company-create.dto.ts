/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AddressCreateDto } from './address-create.dto';

export class CompanyCreateDto {
  name: string;
  address: AddressCreateDto;

  constructor(name: string, address: AddressCreateDto) {
    this.name = name;
    this.address = address;
  }
}
