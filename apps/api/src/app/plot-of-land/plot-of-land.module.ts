import { Module } from '@nestjs/common';
import { PlotOfLandController } from './plot-of-land.controller';

@Module({
  controllers: [PlotOfLandController]
})
export class PlotOfLandModule {}
