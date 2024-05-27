import { ConfigurationModule } from '@forrest-guard/configuration';
import { PrismaService } from '@forrest-guard/database';
import { Module } from '@nestjs/common';
import { PlotsOfLandController } from './plots-of-land.controller';
import { PlotsOfLandService } from './plots-of-land.service';

@Module({
  imports: [ConfigurationModule],
  providers: [PlotsOfLandService, PrismaService],
  controllers: [PlotsOfLandController],
})
export class PlotsOfLandModule {}
