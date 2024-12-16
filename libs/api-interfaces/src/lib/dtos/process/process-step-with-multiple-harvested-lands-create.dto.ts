export class ProcessStepWithMultipleHarvestedLandsCreateDto {
  location: string;
  dateOfProcess: string;
  recordedBy?: string;
  executedBy: string;
  harvestedLands: string[];

  constructor(location: string, dateOfProcess: string, executedBy: string, harvestedLands: string[], recordedBy?: string) {
    this.location = location;
    this.dateOfProcess = dateOfProcess;
    this.executedBy = executedBy;
    this.harvestedLands = harvestedLands;
    this.recordedBy = recordedBy;
  }
}
