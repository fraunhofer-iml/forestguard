/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProcessStepWithMultipleHarvestedLandsCreateDto } from '../process';

export class BatchCombinedCreateDto {
  euInfoSystemId?: string;
  weight: number;
  recipient: string;
  processStep: ProcessStepWithMultipleHarvestedLandsCreateDto;

  constructor(weight: number, recipient: string, processStep: ProcessStepWithMultipleHarvestedLandsCreateDto, euInfoSystemId?: string) {
    this.weight = weight;
    this.recipient = recipient;
    this.processStep = processStep;
    this.euInfoSystemId = euInfoSystemId;
  }
}
