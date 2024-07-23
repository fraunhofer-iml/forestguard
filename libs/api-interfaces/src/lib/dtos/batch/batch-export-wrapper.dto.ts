import { BatchExportDto } from './batch-export.dto';

export class BatchExportWrapperDto {
  requestDate: string;
  rootBatch: BatchExportDto;

  constructor(requestDate: string, batchInformation: BatchExportDto) {
    this.requestDate = requestDate;
    this.rootBatch = batchInformation;
  }
}
