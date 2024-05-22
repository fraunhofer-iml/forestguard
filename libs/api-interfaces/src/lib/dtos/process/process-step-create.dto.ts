export class ProcessStepCreateDto {
  location: string;
  date: string;
  process: string;
  recordedBy?: string;
  executedBy: string;
  harvestedLand?: string;

  constructor(location: string, date: string, process: string, executedBy: string, recordedBy?: string, harvestedLand?: string) {
    this.location = location;
    this.date = date;
    this.process = process;
    this.executedBy = executedBy;
    this.recordedBy = recordedBy;
    this.harvestedLand = harvestedLand;
  }
}
