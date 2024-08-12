import { ConfigurationModule } from '@forest-guard/configuration';
import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { BatchModule } from './batch/batch.module';
import { CompanyModule } from './company/company.module';
import { CultivationModule } from './cultivation/cultivation.module';
import { PlotOfLandModule } from './plot-of-land/plot-of-land.module';
import { ProcessModule } from './process/process.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigurationModule,
    AuthenticationModule,
    BatchModule,
    CompanyModule,
    CultivationModule,
    PlotOfLandModule,
    ProcessModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
