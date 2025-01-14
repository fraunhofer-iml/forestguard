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
