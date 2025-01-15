/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchCreateDto } from '../../dtos';
import { processStepCreate1Mock } from '../process';

export const batchCreate1Mock: BatchCreateDto = {
  euInfoSystemId: 'EU Info',
  ins: ['8918e6b7-e288-4f95-bc87-9d8530e66ad1'],
  weight: 0,
  recipient: '13c9913c-d324-43d1-b834-f536a9e0453c',
  processStep: processStepCreate1Mock,
};
