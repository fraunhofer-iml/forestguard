export class ImportResponseDto {
  employeesCreated: number;
  farmersCreated: number;
  plotsOfLandCreated: number;
  errors: string[];

  constructor(employeesCreated: number, farmersCreated: number, plotsOfLandCreated: number, errors: string[]) {
    this.employeesCreated = employeesCreated;
    this.farmersCreated = farmersCreated;
    this.plotsOfLandCreated = plotsOfLandCreated;
    this.errors = errors;
  }
}
