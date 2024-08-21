import { GeoDataDto } from './geo-data.dto';

export class PlotOfLandCreateDto {
  country: string;
  region: string;
  district: string;
  nationalPlotOfLandId?: string;
  localPlotOfLandId?: string;
  description: string;
  geoData: GeoDataDto;
  areaInHA: number;
  cultivatedWith: string;

  constructor(
    country: string,
    region: string,
    district: string,
    description: string,
    geoData: GeoDataDto,
    areaInHA: number,
    cultivatedWith: string,
    nationalPlotOfLandId?: string,
    localPlotOfLandId?: string
  ) {
    this.country = country;
    this.region = region;
    this.district = district;
    this.description = description;
    this.geoData = geoData;
    this.areaInHA = areaInHA;
    this.cultivatedWith = cultivatedWith;
    this.nationalPlotOfLandId = nationalPlotOfLandId;
    this.localPlotOfLandId = localPlotOfLandId;
  }
}
