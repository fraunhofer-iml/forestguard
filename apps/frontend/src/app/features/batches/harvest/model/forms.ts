/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface HarvestForm {
  processOwner: FormControl<string | UserOrFarmerDto | null>;
  recipient: FormControl<string | CompanyDto | null>;
  weight: FormControl<number | null>;
  dateOfProcess: FormControl<Date | null>;
  plotsOfLand: FormArray<FormGroup>;
  authorOfEntry: FormControl<string | UserOrFarmerDto | null>;
}
