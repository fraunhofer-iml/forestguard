import { Broker } from '@forest-guard/amqp';
import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';

@Module({
  imports: [new Broker().getProcessBroker()],
  controllers: [BatchController],
  providers: [BatchService],
})
export class BatchModule {}
