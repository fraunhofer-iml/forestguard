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

import { Coordinates, GeoDataDto, PlotOfLandCreateDto } from '@forest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';

export class GeneratePlotOfLandService {
  public createGeoData(formGroup: FormGroup, coordinates: Coordinates): GeoDataDto {
    return new GeoDataDto(
      formGroup.value.geoDataStandard ?? '',
      formGroup.value.geoDataType ?? '',
      coordinates,
      formGroup.value.geoDataZone ?? ''
    );
  }

  public createNewPlotOfLand(formGroup: FormGroup, geoInfoForm: FormGroup, coordinates: Coordinates): PlotOfLandCreateDto {
    return new PlotOfLandCreateDto(
      '',
      formGroup.value.region ?? '',
      '',
      '',
      formGroup.value.plotOfLand ?? '',
      this.createGeoData(geoInfoForm, coordinates),
      0,
      formGroup.value.cultivationSort ?? '',
      formGroup.value.cultivationQuality ?? '',
      formGroup.value.nationalPlotOfLandId ?? '',
      formGroup.value.localPlotOfLandId ?? ''
    );
  }
}
