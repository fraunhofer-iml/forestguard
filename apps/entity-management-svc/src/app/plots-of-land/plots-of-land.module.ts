import { ConfigurationModule } from '@forrest-guard/configuration';
import { PrismaService } from '@forrest-guard/database';
import { FileStorageModule } from '@forrest-guard/file-storage';
import { Module } from '@nestjs/common';
import { PlotsOfLandController } from './plots-of-land.controller';
import { PlotsOfLandService } from './plots-of-land.service';
import { ProofService } from './proof.service';

@Module({
  imports: [ConfigurationModule, FileStorageModule],
  providers: [PlotsOfLandService, ProofService, PrismaService],
  controllers: [PlotsOfLandController],
})
export class PlotsOfLandModule {}
