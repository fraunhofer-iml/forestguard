import { PlotOfLandCreateDto } from '@forrest-guard/api-interfaces';

/**
 * Delete later by Ticket FOR-219
 */
export class PlotOfLandMockService {
  public createNewPlotOfLand(plotOfLandDescription: string): PlotOfLandCreateDto {
    return {
      country: '',
      region: '',
      district: '',
      nationalPlotOfLandId: '',
      localPlotOfLandId: '',
      description: plotOfLandDescription,
      polygonData: '',
      areaInHA: 0,
      cultivatedWith: '',
    };
  }
}
