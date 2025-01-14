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
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import apiConfiguration from './configurations/api.configuration';
import entityManagementSvcConfiguration from './configurations/entity-management-svc.configuration';
import generalConfiguration from './configurations/general.configuration';
import keycloakConfiguration from './configurations/keycloak.configuration';
import processSvcConfiguration from './configurations/process-svc.configuration';
import { KeycloakConfigurationService } from './keycloak.configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../../.env'],
      isGlobal: true,
      cache: true,
      load: [
        apiConfiguration,
        entityManagementSvcConfiguration,
        generalConfiguration,
        keycloakConfiguration,
        processSvcConfiguration,
      ],
    }),
  ],
  controllers: [],
  providers: [ConfigurationService, KeycloakConfigurationService],
  exports: [ConfigurationService, KeycloakConfigurationService],
})
export class ConfigurationModule {}
