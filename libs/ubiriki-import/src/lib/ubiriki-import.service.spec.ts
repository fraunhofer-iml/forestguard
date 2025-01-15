/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UbirikiImportService } from './ubiriki-import.service';

describe('UbirikiImportService', () => {
  let service: UbirikiImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UbirikiImportService],
    }).compile();

    service = module.get<UbirikiImportService>(UbirikiImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
