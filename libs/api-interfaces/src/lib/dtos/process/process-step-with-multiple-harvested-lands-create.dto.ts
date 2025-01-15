/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export class ProcessStepWithMultipleHarvestedLandsCreateDto {
  location: string;
  dateOfProcess: string;
  recordedBy?: string;
  executedBy: string;
  harvestedLands: string[];

  constructor(location: string, dateOfProcess: string, executedBy: string, harvestedLands: string[], recordedBy?: string) {
    this.location = location;
    this.dateOfProcess = dateOfProcess;
    this.executedBy = executedBy;
    this.harvestedLands = harvestedLands;
    this.recordedBy = recordedBy;
  }
}
