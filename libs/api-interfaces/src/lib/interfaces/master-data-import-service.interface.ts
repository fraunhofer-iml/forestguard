import 'multer';
import { ImportDto } from '../dtos';

export interface MasterDataImportService {
  readonly COMPANY_IDENTIFIER: string;

  import(file: Express.Multer.File): Promise<ImportDto>;
}
