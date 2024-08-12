import { Broker } from '@forest-guard/amqp';
import { Module } from '@nestjs/common';
import { CultivationController } from './cultivation.controller';
import { CultivationService } from './cultivation.service';

@Module({
  imports: [new Broker().getEntityManagementBroker()],
  controllers: [CultivationController],
  providers: [CultivationService],
})
export class CultivationModule {}
