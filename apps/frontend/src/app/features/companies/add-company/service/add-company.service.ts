/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
