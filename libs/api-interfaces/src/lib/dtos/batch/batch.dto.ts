import { CompanyDto, UserDto } from '../entity';
import { ProcessStepDto } from '../process';

export class BatchDto {
  id: string;
  euInfoSystemId?: string;
  weight: number;
  active: boolean;
  recipient: UserDto | CompanyDto;
  processStep: ProcessStepDto;
  hasAllProofs?: boolean;

  constructor(
    id: string,
    weight: number,
    active: boolean,
    recipient: UserDto | CompanyDto,
    processStep: ProcessStepDto,
    euInfoSystemId?: string,
    hasAllProofs?: boolean
  ) {
    this.id = id;
    this.weight = weight;
    this.active = active;
    this.recipient = recipient;
    this.processStep = processStep;
    this.euInfoSystemId = euInfoSystemId;
    this.hasAllProofs = hasAllProofs;
  }
}
