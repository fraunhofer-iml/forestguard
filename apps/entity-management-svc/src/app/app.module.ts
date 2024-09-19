import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { CultivationModule } from './cultivation/cultivation.module';
import { DocumentsModule } from './documents/documents.module';
import { PlotsOfLandModule } from './plots-of-land/plots-of-land.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CompanyModule, CultivationModule, PlotsOfLandModule, UserModule, DocumentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
