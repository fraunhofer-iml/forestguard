export class ProcessStepWithMultipleHarvestedLandsCreateDto {
  location: string;
  date: string;
  recordedBy?: string;
  executedBy: string;
  harvestedLands: string[];

  constructor(location: string, date: string, executedBy: string, harvestedLands: string[], recordedBy?: string) {
    this.location = location;
    this.date = date;
    this.executedBy = executedBy;
    this.harvestedLands = harvestedLands;
    this.recordedBy = recordedBy;
  }
}
