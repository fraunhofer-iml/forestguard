export interface PlotOfLandCreateDto {
  country: string;
  region: string;
  district: string;
  nationalPlotOfLandId?: string;
  localPlotOfLandId?: string;
  description: string;
  polygonData: string;
  areaInHA: number;
  cultivatedWith?: string;
}
