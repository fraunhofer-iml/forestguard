import { Broker } from '@forrest-guard/amqp';
import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [new Broker().getEntityManagementBroker(), new Broker().getProcessBroker()],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
