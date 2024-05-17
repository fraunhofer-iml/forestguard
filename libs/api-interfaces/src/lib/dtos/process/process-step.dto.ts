import { CompanyDto, UserDto } from '../entity';
import { ProcessDto } from './process.dto';
import { PlotOfLandDto } from '../plot-of-land';

export interface ProcessStepDto {
  id: string;
  location: string;
  date: string;
  process: ProcessDto;
  recordedBy?: UserDto;
  executedBy: UserDto | CompanyDto;
  farmedLand?: PlotOfLandDto;
}
