import { ImportMessagePatterns } from '@forest-guard/amqp';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ImportService } from './import.service';
import { ImportResponseDto } from '@forest-guard/api-interfaces';

@Controller()
export class ImportController {
  constructor(private readonly importService: ImportService) {
  }

  @MessagePattern(ImportMessagePatterns.IMPORT_MASTER_DATA)
  importMasterData(@Payload() payload: {file: Express.Multer.File, companyId: string}): Promise<ImportResponseDto> {
    return this.importService.importMasterData(payload);
  }
}
