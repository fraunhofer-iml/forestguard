/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AddressCreateDto } from './address-create.dto';

export class AddressDto extends AddressCreateDto {
  id: string;

  constructor(id: string, street: string, postalCode: string, city: string, state: string, country: string, additionalInformation: string) {
    super(street, postalCode, city, state, country, additionalInformation);
    this.id = id;
  }
}
