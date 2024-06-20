export class PlotOfLandCreateDto {
  country: string;
  region: string;
  district: string;
  nationalPlotOfLandId?: string;
  localPlotOfLandId?: string;
  description: string;
  polygonData: string;
  areaInHA: number;
  cultivatedWith: string;

  constructor(
    country: string,
    region: string,
    district: string,
    description: string,
    polygonData: string,
    areaInHA: number,
    cultivatedWith: string,
    nationalPlotOfLandId?: string,
    localPlotOfLandId?: string
  ) {
    this.country = country;
    this.region = region;
    this.district = district;
    this.description = description;
    this.polygonData = polygonData;
    this.areaInHA = areaInHA;
    this.cultivatedWith = cultivatedWith;
    this.nationalPlotOfLandId = nationalPlotOfLandId;
    this.localPlotOfLandId = localPlotOfLandId;
  }
}
