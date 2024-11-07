import { Injectable } from '@nestjs/common';
import 'multer';
import { ImportDto, MasterDataImportService } from '@forest-guard/api-interfaces';

@Injectable()
export class UbirikiImportService implements MasterDataImportService {
  readonly COMPANY_IDENTIFIER = 'Cooperative';

  async import(file: Express.Multer.File): Promise<ImportDto> {
    return {
      employees: [],
      farmersAndPlotsOfLand: [],
    };
  }
}
