import { Broker } from '@forest-guard/amqp';
import { Module } from '@nestjs/common';
import { ProcessStepController } from './process-step.controller';
import { ProcessStepService } from './process-step.service';

@Module({
  imports: [new Broker().getEntityManagementBroker()],
  controllers: [ProcessStepController],
  providers: [ProcessStepService],
})
export class ProcessStepModule {}
