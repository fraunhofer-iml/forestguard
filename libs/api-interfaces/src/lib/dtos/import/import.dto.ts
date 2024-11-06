import { FarmerCreateDto, UserUpdateDto } from '../entity';
import { PlotOfLandCreateDto } from '../plot-of-land';

export class ImportDto {
  employees: UserUpdateDto[];
  farmersAndPlotsOfLand: FarmerAndPlotOfLand[];

  constructor(employees: UserUpdateDto[], farmersAndPlotsOfLand: FarmerAndPlotOfLand[]) {
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
