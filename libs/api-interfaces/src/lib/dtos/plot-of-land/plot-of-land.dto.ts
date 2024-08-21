import { CultivationDto } from './cultivation.dto';
import { ProofDto } from './proof.dto';

export class PlotOfLandDto {
  id: string;
  country?: string;
  region?: string;
  district?: string;
  nationalPlotOfLandId?: string;
  localPlotOfLandId?: string;
  description?: string;
  geoData?: string;
  areaInHA?: number;
  cultivatedWith?: CultivationDto;
  proofs?: ProofDto[];

  constructor(
    id: string,
    country?: string,
    region?: string,
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
