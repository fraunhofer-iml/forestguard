import { ProcessStepWithMultipleHarvestedLandsCreateDto } from '../process';

export class BatchCombinedCreateDto {
  idEUInfoSystem?: string;
  weight: number;
  recipient: string;
  processStep: ProcessStepWithMultipleHarvestedLandsCreateDto;

  constructor(weight: number, recipient: string, processStep: ProcessStepWithMultipleHarvestedLandsCreateDto, idEUInfoSystem?: string) {
    this.weight = weight;
    this.recipient = recipient;
    this.processStep = processStep;
    this.idEUInfoSystem = idEUInfoSystem;
  }
}
