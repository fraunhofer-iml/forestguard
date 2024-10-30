import { ImportDto } from '../dtos';

export interface MasterDataImportService {
  readonly COMPANY_IDENTIFIER: string;

  import(file: unknown): Promise<ImportDto>;
}
