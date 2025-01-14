/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
