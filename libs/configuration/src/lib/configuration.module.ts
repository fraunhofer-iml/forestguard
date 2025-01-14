/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
