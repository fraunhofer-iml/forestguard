import { Broker } from '@forest-guard/amqp';
import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';

@Module({
  imports: [new Broker().getEntityManagementBroker()],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
