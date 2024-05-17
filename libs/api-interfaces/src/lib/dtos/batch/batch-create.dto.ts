import { ProcessStepCreateDto } from '../process';

export interface BatchCreateDto {
  idEUInfoSystem?: string;
  in: string[];
  weight: number;
  recipient: string;
  processStep: ProcessStepCreateDto;
}
