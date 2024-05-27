import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [CompanyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
