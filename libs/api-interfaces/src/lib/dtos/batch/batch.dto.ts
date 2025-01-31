/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyDto, UserDto } from '../entity';
import { ProcessStepDto } from '../process';

export class BatchDto {
  id: string;
  euInfoSystemId?: string;
  hsCode?: string;
  weight: number;
  active: boolean;
  recipient: UserDto | CompanyDto;
  processStep: ProcessStepDto;
  hasAllProofs?: boolean;

  constructor(
    id: string,
    weight: number,
    active: boolean,
    recipient: UserDto | CompanyDto,
    processStep: ProcessStepDto,
    euInfoSystemId?: string,
    hsCode?: string,
    hasAllProofs?: boolean
  ) {
    this.id = id;
    this.weight = weight;
    this.active = active;
    this.recipient = recipient;
    this.processStep = processStep;
    this.euInfoSystemId = euInfoSystemId;
    this.hsCode = hsCode;
    this.hasAllProofs = hasAllProofs;
  }
}
