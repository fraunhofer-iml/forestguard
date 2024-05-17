export interface ProcessStepCreateDto {
  location: string;
  date: string;
  process: string;
  recordedBy?: string;
  executedBy: string;
  harvestedLand?: string;
}
