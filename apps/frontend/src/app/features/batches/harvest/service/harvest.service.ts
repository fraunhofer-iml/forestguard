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

import {
  BatchCombinedCreateDto,
  CompanyDto,
  ProcessStepWithMultipleHarvestedLandsCreateDto,
  UserOrFarmerDto,
} from '@forest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';
import { HarvestForm } from '../model/forms';

export class HarvestService {
  public createNewProcessStep(formGroup: FormGroup<HarvestForm>, plotsOfLand: string[]): ProcessStepWithMultipleHarvestedLandsCreateDto {
    return new ProcessStepWithMultipleHarvestedLandsCreateDto(
      '',
      formGroup.value.dateOfProcess?.toISOString() ?? '',
      (formGroup.value.processOwner as UserOrFarmerDto).id ?? '',
      plotsOfLand ?? [],
      (formGroup.value.authorOfEntry as UserOrFarmerDto).id ?? ''
    );
  }

  public createNewHarvestBatch(formGroup: FormGroup<HarvestForm>, plotsOfLand: string[]): BatchCombinedCreateDto {
    return new BatchCombinedCreateDto(
      formGroup.value.weight ?? 0,
      (formGroup.value.recipient as CompanyDto).id ?? '',
      this.createNewProcessStep(formGroup, plotsOfLand)
    );
  }
}
