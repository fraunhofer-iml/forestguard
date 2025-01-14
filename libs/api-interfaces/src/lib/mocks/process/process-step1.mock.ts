/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProcessStepDto } from '../../dtos';
import { user1Mock } from '../entity';
import { plotOfLand1Mock } from '../plot-of-land';
import { process1Mock } from './process1.mock';

export const processStep1Mock: ProcessStepDto = {
  id: '6eb8e77c-cc08-44de-9b7a-2cdfc9387e7d',
  location: 'location',
  dateOfProcess: new Date('2024-05-13T13:08:44.247Z'),
  dateOfEntry: new Date('2024-05-12T13:08:44.247Z'),
  process: process1Mock,
  recordedBy: user1Mock,
  executedBy: user1Mock,
  farmedLand: plotOfLand1Mock,
};
