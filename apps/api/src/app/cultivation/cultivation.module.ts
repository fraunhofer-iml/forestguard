import { Module } from '@nestjs/common';
import { CultivationController } from './cultivation.controller';

@Module({
  controllers: [CultivationController]
})
export class CultivationModule {}
