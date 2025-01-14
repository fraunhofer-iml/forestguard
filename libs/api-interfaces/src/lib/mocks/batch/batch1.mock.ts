/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchDto } from '../../dtos';
import { user1Mock } from '../entity';
import { processStep1Mock } from '../process';

export const batch1Mock: BatchDto = {
  id: '8918e6b7-e288-4f95-bc87-9d8530e66ad1',
  euInfoSystemId: 'EU Info',
  weight: 0,
  active: true,
  recipient: user1Mock,
  processStep: processStep1Mock,
};
