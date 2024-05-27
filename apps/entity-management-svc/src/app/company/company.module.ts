import { ConfigurationModule } from '@forrest-guard/configuration';
import { PrismaService } from '@forrest-guard/database';
import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [ConfigurationModule],
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService],
})
export class CompanyModule {}
