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
        generalConfiguration, 
        apiConfiguration, 
        processSvcConfiguration, 
        entityManagementSvcConfiguration, 
        keycloakConfiguration, 
      ],
    }),
  ],
  controllers: [],
  providers: [ConfigurationService, KeycloakConfigurationService],
  exports: [ConfigurationService, KeycloakConfigurationService],
})
export class ConfigurationModule {}
