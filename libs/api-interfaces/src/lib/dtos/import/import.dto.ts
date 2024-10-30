import { FarmerCreateDto, UserUpdateDto } from '../entity';
import { PlotOfLandCreateDto } from '../plot-of-land';

export class ImportDto {
  employees: UserUpdateDto[];
  farmersAndPlotOfLands: FarmerAndPlotOfLand[];

  constructor(employees: UserUpdateDto[], farmersAndPlotOfLands: FarmerAndPlotOfLand[]) {
    this.employees = employees;
    this.farmersAndPlotOfLands = farmersAndPlotOfLands;
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
