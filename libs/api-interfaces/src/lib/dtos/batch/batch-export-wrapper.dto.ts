/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchExportDto } from './batch-export.dto';

export class BatchExportWrapperDto {
  requestDate: string;
  rootBatch: BatchExportDto;

  constructor(requestDate: string, batchInformation: BatchExportDto) {
    this.requestDate = requestDate;
    this.rootBatch = batchInformation;
  }
}
