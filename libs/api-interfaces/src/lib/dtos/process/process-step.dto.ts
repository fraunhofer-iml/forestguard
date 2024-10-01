import { CompanyDto, UserDto } from '../entity';
import { PlotOfLandDto } from '../plot-of-land';
import { ProcessDto } from './process.dto';
import { DocumentDto } from './document.dto';

export class ProcessStepDto {
  id: string;
  location: string;
  date: Date;
  process: ProcessDto;
  recordedBy?: UserDto | CompanyDto;
  executedBy: UserDto | CompanyDto;
  documents?: DocumentDto[];
  farmedLand?: PlotOfLandDto;

  constructor(
    id: string,
    location: string,
    date: Date,
    process: ProcessDto,
    executedBy: UserDto | CompanyDto,
    recordedBy?: UserDto,
    documents?: DocumentDto[],
    farmedLand?: PlotOfLandDto
  ) {
    this.id = id;
    this.location = location;
    this.date = date;
    this.process = process;
    this.executedBy = executedBy;
    this.recordedBy = recordedBy;
    this.documents = documents;
    this.farmedLand = farmedLand;
  }
}
