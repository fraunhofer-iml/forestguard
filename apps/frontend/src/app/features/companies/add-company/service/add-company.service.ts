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

import { AddressCreateDto, CompanyCreateDto } from '@forest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';
import { CompanyForm } from '../model/forms';

export class AddCompanyService {
  public generateAddress(formGroup: FormGroup<CompanyForm>): AddressCreateDto {
    return new AddressCreateDto(
      formGroup.value.street ?? '',
      formGroup.value.postalCode ?? '',
      formGroup.value.city ?? '',
      formGroup.value.state ?? '',
      formGroup.value.country ?? '',
      formGroup.value.additionalInformation ?? ''
    );
  }

  public generateCompany(formGroup: FormGroup<CompanyForm>): CompanyCreateDto {
    return new CompanyCreateDto(formGroup?.value?.name ?? '', this.generateAddress(formGroup));
  }
}
