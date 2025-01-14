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
