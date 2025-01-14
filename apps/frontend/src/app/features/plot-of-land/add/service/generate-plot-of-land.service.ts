/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
