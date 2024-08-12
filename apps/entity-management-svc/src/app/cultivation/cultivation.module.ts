import { ConfigurationModule } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { Module } from '@nestjs/common';
import { CultivationController } from './cultivation.controller';
import { CultivationService } from './cultivation.service';

@Module({
  imports: [ConfigurationModule],
  providers: [CultivationService, PrismaService],
  controllers: [CultivationController],
})
export class CultivationModule {}
