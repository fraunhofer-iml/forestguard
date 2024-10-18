import { ProcessStepCreateDto } from '../process';

export class BatchCreateDto {
  euInfoSystemId?: string;
  ins: string[];
  weight: number;
  recipient: string;
  processStep: ProcessStepCreateDto;

  constructor(ins: string[], weight: number, recipient: string, processStep: ProcessStepCreateDto, euInfoSystemId?: string) {
    this.ins = ins;
    this.weight = weight;
    this.recipient = recipient;
    this.processStep = processStep;
    this.euInfoSystemId = euInfoSystemId;
  }
}
