import { ProcessStepCreateDto } from '../process';

export class BatchCreateDto {
  idEUInfoSystem?: string;
  ins: string[];
  weight: number;
  recipient: string;
  processStep: ProcessStepCreateDto;

  constructor(ins: string[], weight: number, recipient: string, processStep: ProcessStepCreateDto, idEUInfoSystem?: string) {
    this.ins = ins;
    this.weight = weight;
    this.recipient = recipient;
    this.processStep = processStep;
    this.idEUInfoSystem = idEUInfoSystem;
  }
}
