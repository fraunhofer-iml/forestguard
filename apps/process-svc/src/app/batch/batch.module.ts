import { PrismaService } from '@forrest-guard/database';
import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { RelatedBatchesService } from './related/related-batches.service';

@Module({
  controllers: [BatchController],
  providers: [BatchService, PrismaService, RelatedBatchesService],
})
export class BatchModule {}
