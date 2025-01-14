/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyDto, UserDto } from '../entity';
import { PlotOfLandDto } from '../plot-of-land';
import { DocumentDto } from './document.dto';
import { ProcessDto } from './process.dto';

export class ProcessStepDto {
  id: string;
  location: string;
  dateOfProcess: Date;
  dateOfEntry: Date;
  process: ProcessDto;
  recordedBy?: UserDto | CompanyDto;
  executedBy: UserDto | CompanyDto;
  documents?: DocumentDto[];
  farmedLand?: PlotOfLandDto;

  constructor(
    id: string,
    location: string,
    dateOfProcess: Date,
    dateOfEntry: Date,
    process: ProcessDto,
    executedBy: UserDto | CompanyDto,
    recordedBy?: UserDto,
    documents?: DocumentDto[],
    farmedLand?: PlotOfLandDto
  ) {
    this.id = id;
    this.location = location;
    this.dateOfProcess = dateOfProcess;
    this.dateOfEntry = dateOfEntry;
    this.process = process;
    this.executedBy = executedBy;
    this.recordedBy = recordedBy;
    this.documents = documents;
    this.farmedLand = farmedLand;
  }
}
