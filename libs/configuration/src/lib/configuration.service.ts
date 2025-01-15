/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, Logger, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API_CONFIG_IDENTIFIER, ApiConfiguration } from './configurations/api.configuration';
import {
  ENTITY_MANAGEMENT_CONFIG_IDENTIFIER,
  EntityManagementSvcConfiguration,
} from './configurations/entity-management-svc.configuration';
import { GENERAL_CONFIG_IDENTIFIER, GeneralConfiguration } from './configurations/general.configuration';
import { KEYCLOAK_IDENTIFIER, KeycloakConfiguration } from './configurations/keycloak.configuration';
import { PROCESS_CONFIG_IDENTIFIER, ProcessSvcConfiguration } from './configurations/process-svc.configuration';

@Injectable()
export class ConfigurationService {
  logger = new Logger(ConfigurationService.name);
  constructor(private readonly configService: ConfigService) {}

  public getLogLevel(): LogLevel[] {
    const logLevel = this.configService.get<string>('LOG_SETTINGS', 'error,verbose').split(',');
    return <LogLevel[]>logLevel;
  }

  public getGeneralConfiguration(): GeneralConfiguration | undefined {
    return this.configService.get<GeneralConfiguration>(GENERAL_CONFIG_IDENTIFIER);
  }

  public getApiConfiguration(): ApiConfiguration | undefined {
    return this.configService.get<ApiConfiguration>(API_CONFIG_IDENTIFIER);
  }

  public getEntityManagementConfiguration(): EntityManagementSvcConfiguration | undefined {
    return this.configService.get<EntityManagementSvcConfiguration>(ENTITY_MANAGEMENT_CONFIG_IDENTIFIER);
  }

  public getProcessConfiguration(): ProcessSvcConfiguration | undefined {
    return this.configService.get<ProcessSvcConfiguration>(PROCESS_CONFIG_IDENTIFIER);
  }

  public getKeycloakConfig(): KeycloakConfiguration {
    const keycloakConfig = this.configService.get<KeycloakConfiguration>(KEYCLOAK_IDENTIFIER);
    if (!keycloakConfig) {
      const msg = 'Environment variables for keycloak configuration missing!';
      this.logger.error(msg);
      throw new Error(msg);
    }
    return keycloakConfig;
  }
}
