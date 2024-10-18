import { ProcessStepWithMultipleHarvestedLandsCreateDto } from '../process';

export class BatchCombinedCreateDto {
  euInfoSystemId?: string;
  weight: number;
  recipient: string;
  processStep: ProcessStepWithMultipleHarvestedLandsCreateDto;

  constructor(weight: number, recipient: string, processStep: ProcessStepWithMultipleHarvestedLandsCreateDto, euInfoSystemId?: string) {
    this.weight = weight;
    this.recipient = recipient;
    this.processStep = processStep;
    this.euInfoSystemId = euInfoSystemId;
  }
}
