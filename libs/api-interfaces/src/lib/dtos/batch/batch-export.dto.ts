import { CompanyDto, UserDto } from '../entity';
import { ProcessStepDto } from '../process';
import { BatchDto } from './batch.dto';

export class BatchExportDto extends BatchDto{
  ins: BatchExportDto[];
  outs: BatchExportDto[];

  constructor(id: string, weight: number, active: boolean, recipient: UserDto | CompanyDto, processStep: ProcessStepDto, idEUInfoSystem: string, ins: BatchExportDto[], outs: BatchExportDto[]) {
    super(id, weight, active, recipient, processStep, idEUInfoSystem);
    this.ins = ins;
    this.outs = outs;
  }
}
