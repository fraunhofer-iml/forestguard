import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { PlotsOfLandModule } from './plots-of-land/plots-of-land.module';

@Module({
  imports: [CompanyModule, PlotsOfLandModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
