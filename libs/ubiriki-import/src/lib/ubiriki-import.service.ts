import { Injectable } from '@nestjs/common';
import 'multer';
import { ImportDto, MasterDataImportService } from '@forest-guard/api-interfaces';

@Injectable()
export class UbirikiImportService implements MasterDataImportService {
  readonly COMPANY_IDENTIFIER = 'C.A.C. Sostenible Valle Ubiriki';

  async import(
    file: Express.Multer.File,
  ): Promise<ImportDto> {
    return {
      employees: [],
      farmersAndPlotsOfLand: [],
    };
  }
}
