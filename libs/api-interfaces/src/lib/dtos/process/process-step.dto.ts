import { CompanyDto, UserDto } from '../entity';
import { PlotOfLandDto } from '../plot-of-land';
import { ProcessDto } from './process.dto';

export class ProcessStepDto {
  id: string;
  location: string;
  date: string;
  process: ProcessDto;
  recordedBy?: UserDto;
  executedBy: UserDto | CompanyDto;
  farmedLand?: PlotOfLandDto;

  constructor(
    id: string,
    location: string,
    date: string,
    process: ProcessDto,
    executedBy: UserDto | CompanyDto,
    recordedBy?: UserDto,
    farmedLand?: PlotOfLandDto
  ) {
    this.id = id;
    this.location = location;
    this.date = date;
    this.process = process;
    this.executedBy = executedBy;
    this.recordedBy = recordedBy;
    this.farmedLand = farmedLand;
  }
}
