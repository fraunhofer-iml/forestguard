import { GeoDataDto } from './geo-data.dto';

export class PlotOfLandCreateDto {
  country: string;
  region: string;
  province: string;
  district: string;
  nationalPlotOfLandId?: string;
  localPlotOfLandId?: string;
  description: string;
  geoData: GeoDataDto;
  areaInHA: number;
  cultivationSort: string;
  cultivationQuality: string;

  constructor(
    country: string,
    region: string,
    province: string,
    district: string,
    description: string,
    geoData: GeoDataDto,
    areaInHA: number,
    cultivationSort: string,
    cultivationQuality: string,
    nationalPlotOfLandId?: string,
    localPlotOfLandId?: string
  ) {
    this.country = country;
    this.region = region;
    this.province = province;
    this.district = district;
    this.description = description;
    this.geoData = geoData;
    this.areaInHA = areaInHA;
    this.cultivationSort = cultivationSort;
    this.cultivationQuality = cultivationQuality;
    this.nationalPlotOfLandId = nationalPlotOfLandId;
    this.localPlotOfLandId = localPlotOfLandId;
  }
}
