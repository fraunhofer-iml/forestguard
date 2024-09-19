import { PrismaService } from '@forest-guard/database';
import { FileStorageModule } from '@forest-guard/file-storage';
import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  imports: [FileStorageModule],
  controllers: [DocumentsController],
  providers: [PrismaService, DocumentsService],
})
export class DocumentsModule {}
