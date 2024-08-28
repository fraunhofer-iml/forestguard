import { Broker } from '@forest-guard/amqp';
import { Module } from '@nestjs/common';
import { CompanyModule } from '../company/company.module';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';

@Module({
  imports: [new Broker().getProcessBroker(), CompanyModule],
  controllers: [BatchController],
  providers: [BatchService],
})
export class BatchModule {}
