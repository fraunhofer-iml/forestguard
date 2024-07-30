import { PrismaService } from '@forrest-guard/database';
import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchCreateService } from './create/batch-create.service';
import { BatchReadRelatedService } from './related/batch-read-related.service';
import { BatchExportService } from './export/batch-export.service';
import { BatchReadService } from './read/batch-read.service';

@Module({
  controllers: [BatchController],
  providers: [BatchCreateService, BatchReadService, BatchReadRelatedService, BatchExportService, PrismaService],
})
export class BatchModule {
}
