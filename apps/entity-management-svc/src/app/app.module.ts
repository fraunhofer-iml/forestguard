/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { CultivationModule } from './cultivation/cultivation.module';
import { DocumentModule } from './document/document.module';
import { PlotsOfLandModule } from './plots-of-land/plots-of-land.module';
import { UserModule } from './user/user.module';
import { ImportModule } from './import/import.module';

@Module({
  imports: [CompanyModule, CultivationModule, PlotsOfLandModule, UserModule, DocumentModule, ImportModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
