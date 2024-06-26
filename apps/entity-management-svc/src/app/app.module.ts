import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { CultivationModule } from './cultivation/cultivation.module';
import { PlotsOfLandModule } from './plots-of-land/plots-of-land.module';

@Module({
  imports: [CompanyModule, CultivationModule, PlotsOfLandModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
