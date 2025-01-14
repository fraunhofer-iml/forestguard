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

import { ConfigurationModule, KeycloakConfigurationService } from '@forest-guard/configuration';
import { AuthGuard, KeycloakConnectModule, RoleGuard } from 'nest-keycloak-connect';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { BatchModule } from './batch/batch.module';
import { CompanyModule } from './company/company.module';
import { CultivationModule } from './cultivation/cultivation.module';
import { PlotOfLandModule } from './plot-of-land/plot-of-land.module';
import { ProcessStepModule } from './process-step/process-step.module';
import { UserModule } from './user/user.module';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    ConfigurationModule,
    BatchModule,
    CompanyModule,
    CultivationModule,
    PlotOfLandModule,
    UserModule,
    ProcessStepModule,
    ImportModule,
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigurationService,
      imports: [ConfigurationModule],
    }),
    // Activate the following line to enable the token endpoints from the blockchain-connector library
    // TokenModule.getDynamicModule(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
