import { ProductDto } from './product.dto';
import { ProofDto } from './proof.dto';

export interface PlotOfLandDto {
  id?: string;
  country?: string;
  region?: string;
  district?: string;
  nationalPlotOfLandId?: string;
  localPlotOfLandId?: string;
  description?: string;
  polygonData?: string;
  areaInHA?: number;
  cultivatedWith?: ProductDto;
  proofs?: ProofDto[];
}
