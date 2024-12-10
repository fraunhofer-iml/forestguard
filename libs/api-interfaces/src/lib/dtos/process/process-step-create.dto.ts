export class ProcessStepCreateDto {
  location: string;
  dateOfProcess: string;
  process: string;
  recordedBy?: string;
  executedBy: string;
  harvestedLand?: string;

  constructor(location: string, dateOfProcess: string, process: string, executedBy: string, recordedBy?: string, harvestedLand?: string) {
    this.location = location;
    this.dateOfProcess = dateOfProcess;
    this.process = process;
    this.executedBy = executedBy;
    this.recordedBy = recordedBy;
    this.harvestedLand = harvestedLand;
  }
}
