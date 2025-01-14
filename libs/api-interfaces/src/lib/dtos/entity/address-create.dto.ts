/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export class AddressCreateDto {
    street: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
    additionalInformation: string;

    constructor(street: string, postalCode: string, city: string, state: string, country: string, additionalInformation: string) {
      this.street = street;
      this.postalCode = postalCode;
      this.city = city;
      this.state = state;
      this.country = country;
      this.additionalInformation = additionalInformation;
    }
  }
