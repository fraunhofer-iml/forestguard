/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
