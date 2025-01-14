/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { FormControl } from '@angular/forms';

export interface PlotOfLandForm {
  processOwner: FormControl<string | UserOrFarmerDto | null>;
  region: FormControl<string | null>;
  plotOfLand: FormControl<string | null>;
  cultivationSort: FormControl<string | null>;
  cultivationQuality: FormControl<string | null>;
  localPlotOfLandId: FormControl<string | null>;
  nationalPlotOfLandId: FormControl<string | null>;
}
