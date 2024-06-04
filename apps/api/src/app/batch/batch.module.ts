import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { Broker } from '@forrest-guard/amqp';

@Module({
  imports: [new Broker().getProcessBroker()],
  controllers: [BatchController],
  providers: [BatchService]
})
export class BatchModule {}
