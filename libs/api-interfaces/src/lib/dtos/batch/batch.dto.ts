import { ProcessStepDto } from '../process';
import { CompanyDto, UserDto } from '../entity';

export interface BatchDto {
  id: string;
  idEUInfoSystem?: string;
  weight: number;
  active: boolean;
  recipient: UserDto | CompanyDto;
  processStep: ProcessStepDto;
}
