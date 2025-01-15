/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export class ProcessStepCreateDto {
  location: string;
  dateOfProcess: string;
  process: string;
  recordedBy?: string;
  executedBy: string;
  harvestedLand?: string;

  constructor(location: string, dateOfProcess: string, process: string, executedBy: string, recordedBy?: string, harvestedLand?: string) {
    this.location = location;
    this.dateOfProcess = dateOfProcess;
    this.process = process;
    this.executedBy = executedBy;
    this.recordedBy = recordedBy;
    this.harvestedLand = harvestedLand;
  }
}
