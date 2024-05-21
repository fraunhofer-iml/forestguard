import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import apiConfiguration from './configurations/api.configuration';
import processSvcConfiguration from './configurations/process-svc.configuration';
import entityManagementSvcConfiguration from './configurations/entity-management-svc.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../../.env'],
      isGlobal: true,
      cache: true,
      load: [apiConfiguration, processSvcConfiguration, entityManagementSvcConfiguration],
    }),
  ],
  controllers: [],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
