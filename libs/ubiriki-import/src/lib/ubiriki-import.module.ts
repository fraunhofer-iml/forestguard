import { Module } from '@nestjs/common';
import { UbirikiImportService } from './ubiriki-import.service';

@Module({
  providers: [UbirikiImportService],
  exports: [UbirikiImportService],
})
export class UbirikiImportModule {}
