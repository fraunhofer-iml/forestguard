import { ConfigurationModule, KeycloakConfigurationService } from '@forest-guard/configuration';
import { AuthGuard, KeycloakConnectModule } from 'nest-keycloak-connect';
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
  ],
})
export class AppModule {}
