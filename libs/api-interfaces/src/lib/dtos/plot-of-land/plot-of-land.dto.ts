import { UserOrFarmerDto } from '../entity';
import { CultivationDto } from './cultivation.dto';
import { ProofDto } from './proof.dto';

export class PlotOfLandDto {
  id: string;
  country?: string;
  region?: string;
  province?: string;
  district?: string;
  nationalPlotOfLandId?: string;
  localPlotOfLandId?: string;
  description?: string;
  geoData?: string;
  areaInHA?: number;
  cultivatedWith?: CultivationDto;
  farmer?: UserOrFarmerDto;
  proofs?: ProofDto[];

  constructor(
    id: string,
    country?: string,
    region?: string,
    province?: string,
    district?: string,
    nationalPlotOfLandId?: string,
    localPlotOfLandId?: string,
    description?: string,
    geoData?: string,
    areaInHA?: number,
    cultivatedWith?: CultivationDto,
    proofs?: ProofDto[]
  ) {
    this.id = id;
    this.country = country;
    this.region = region;
    this.province = province;
    this.district = district;
    this.nationalPlotOfLandId = nationalPlotOfLandId;
    this.localPlotOfLandId = localPlotOfLandId;
    this.description = description;
    this.geoData = geoData;
    this.areaInHA = areaInHA;
    this.cultivatedWith = cultivatedWith;
    this.proofs = proofs;
  }
}
