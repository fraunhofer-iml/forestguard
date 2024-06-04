import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { PrismaService } from '@forrest-guard/database';

@Module({
  controllers: [BatchController],
  providers: [BatchService, PrismaService]
})
export class BatchModule {}
