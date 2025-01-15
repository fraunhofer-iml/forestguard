/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { UbirikiImportModule, UbirikiImportService } from '@forest-guard/ubiriki-import';
import { UserModule } from '../user/user.module';
import { PlotsOfLandModule } from '../plots-of-land/plots-of-land.module';
import { CompanyModule } from '../company/company.module';
import { COMPANY_IMPORT_SERVICES } from './import.constants';

@Module({
  imports: [UbirikiImportModule, CompanyModule, UserModule, PlotsOfLandModule],
  controllers: [ImportController],
  providers: [
    ImportService,
    {
      provide: COMPANY_IMPORT_SERVICES,
      useValue: [new UbirikiImportService()],
    },
  ],
})
export class ImportModule {
}
