/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AddressDto } from '../../dtos';

export const address1Mock: AddressDto = {
  id: 'ctest201',
  street: 'Example Street',
  postalCode: '12345',
  city: 'Example City',
  state: 'Example State',
  country: 'Example Country',
  additionalInformation: 'Good to know',
};
