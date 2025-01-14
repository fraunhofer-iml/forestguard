/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AddressCreateDto, FarmerCreateDto, RoleType, UserCreateDto } from '@forest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';
import { UserForm } from '../model/user-form';

export class GenerateUserService {
  generateNewUser(formGroup: FormGroup<UserForm>): UserCreateDto {
    return new UserCreateDto(
      formGroup.value.firstName ?? '',
      formGroup.value.lastName ?? '',
      formGroup.value.email ?? '',
      formGroup.value.employeeId ?? '',
      formGroup.value.phoneNumber ?? '',
      RoleType.EMPLOYEE
    );
  }

  generateNewFarmer(formGroup: FormGroup): FarmerCreateDto {
    return new FarmerCreateDto(
      formGroup.value.firstName ?? '',
      formGroup.value.lastName ?? '',
      formGroup.value.email ?? '',
      formGroup.value.employeeId ?? '',
      formGroup.value.personalId ?? '',
      formGroup.value.phoneNumber ?? '',
      this.generateNewAddress(formGroup)
    );
  }

  generateNewAddress(formGroup: FormGroup): AddressCreateDto {
    return new AddressCreateDto(
      formGroup.value.street ?? '',
      formGroup.value.postalCode ?? '',
      formGroup.value.city ?? '',
      formGroup.value.state ?? '',
      formGroup.value.country ?? '',
      formGroup.value.additionalInformation ?? ''
    );
  }
}
