/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export class ImportResponseDto {
  employeesCreated: number;
  farmersCreated: number;
  plotsOfLandCreated: number;
  errors: string[];

  constructor(employeesCreated: number, farmersCreated: number, plotsOfLandCreated: number, errors: string[]) {
    this.employeesCreated = employeesCreated;
    this.farmersCreated = farmersCreated;
    this.plotsOfLandCreated = plotsOfLandCreated;
    this.errors = errors;
  }
}
