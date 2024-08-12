import { Broker } from '@forest-guard/amqp';
import { Module } from '@nestjs/common';
import { PlotOfLandController } from './plot-of-land.controller';
import { PlotOfLandService } from './plot-of-land.service';

@Module({
  imports: [new Broker().getEntityManagementBroker()],
  controllers: [PlotOfLandController],
  providers: [PlotOfLandService],
})
export class PlotOfLandModule {}
