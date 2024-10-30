import { PrismaService } from '@forest-guard/database';
import { FileStorageModule } from '@forest-guard/file-storage';
import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [FileStorageModule],
  controllers: [DocumentController],
  providers: [PrismaService, DocumentService],
})
export class DocumentModule {}
