/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProcessStepCreateDto } from '../process';

export class BatchCreateDto {
  euInfoSystemId?: string;
  hsCode?: string;
  ins: string[];
  weight: number;
  recipient: string;
  processStep: ProcessStepCreateDto;

  constructor(ins: string[], weight: number, recipient: string, processStep: ProcessStepCreateDto, euInfoSystemId?: string, hscode?: string) {
    this.ins = ins;
    this.weight = weight;
    this.recipient = recipient;
    this.processStep = processStep;
    this.euInfoSystemId = euInfoSystemId;
    this.hsCode = hscode;
  }
}
