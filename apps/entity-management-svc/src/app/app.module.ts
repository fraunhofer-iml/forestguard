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
