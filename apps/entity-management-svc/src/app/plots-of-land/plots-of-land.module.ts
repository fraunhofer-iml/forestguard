import { ConfigurationModule } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { FileStorageModule } from '@forest-guard/file-storage';
import { Module } from '@nestjs/common';
import { PlotsOfLandController } from './plots-of-land.controller';
import { PlotsOfLandService } from './plots-of-land.service';
import { ProofService } from './proof.service';

@Module({
  imports: [ConfigurationModule, FileStorageModule],
  providers: [PlotsOfLandService, ProofService, PrismaService],
  controllers: [PlotsOfLandController],
  exports: [PlotsOfLandService],
})
export class PlotsOfLandModule {}
