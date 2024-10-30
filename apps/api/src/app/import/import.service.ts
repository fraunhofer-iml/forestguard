import { AmqpClientEnum, ImportMessagePatterns } from '@forest-guard/amqp';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import 'multer';
import { ClientProxy } from '@nestjs/microservices';
import { ImportResponseDto } from '@forest-guard/api-interfaces';

@Injectable()
export class ImportService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {
  }

  importMasterData(file: Express.Multer.File, companyId: string): Promise<ImportResponseDto> {
    return firstValueFrom(this.entityManagementService.send(ImportMessagePatterns.IMPORT_MASTER_DATA, { file, companyId }));
  }
}
