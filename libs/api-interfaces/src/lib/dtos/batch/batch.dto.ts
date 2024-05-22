import { CompanyDto, UserDto } from '../entity';
import { ProcessStepDto } from '../process';

export class BatchDto {
  id: string;
  idEUInfoSystem?: string;
  weight: number;
  active: boolean;
  recipient: UserDto | CompanyDto;
  processStep: ProcessStepDto;

  constructor(
    id: string,
    ins: BatchDto[],
    out: BatchDto[],
    weight: number,
    active: boolean,
    recipient: UserDto | CompanyDto,
    processStep: ProcessStepDto,
    idEUInfoSystem?: string
  ) {
    this.id = id;
    this.in = ins;
    this.out = out;
    this.weight = weight;
    this.active = active;
    this.recipient = recipient;
    this.processStep = processStep;
    this.idEUInfoSystem = idEUInfoSystem;
  }
}
