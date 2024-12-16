import { FarmerCreateDto, UserCreateDto } from '../entity';
import { PlotOfLandCreateDto } from '../plot-of-land';

export class ImportDto {
  employees: UserCreateDto[];
  farmersAndPlotsOfLand: FarmerAndPlotOfLand[];

  constructor(employees: UserCreateDto[], farmersAndPlotsOfLand: FarmerAndPlotOfLand[]) {
    this.employees = employees;
    this.farmersAndPlotsOfLand = farmersAndPlotsOfLand;
  }
}

export class FarmerAndPlotOfLand {
  farmer: FarmerCreateDto;
  plotOfLand: PlotOfLandCreateDto;

  constructor(farmer: FarmerCreateDto, plotOfLand: PlotOfLandCreateDto) {
    this.farmer = farmer;
    this.plotOfLand = plotOfLand;
  }
}
