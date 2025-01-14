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

import { AddressCreateDto, UserOrFarmerDto, UserUpdateDto } from '@forest-guard/api-interfaces';

export class UpdateFarmerService {
  convertFarmerToUserUpdateDto(farmer: UserOrFarmerDto): UserUpdateDto {
    return new UserUpdateDto(
      farmer?.firstName,
      farmer?.lastName,
      farmer?.email,
      farmer?.mobilePhoneNumber,
      this.updateAddress(farmer?.address)
    );
  }

  updateAddress(address: AddressCreateDto | undefined): AddressCreateDto {
    if (!address) {
      return new AddressCreateDto('', '', '', '', '', '');
    }
    return new AddressCreateDto(
      address.street,
      address.postalCode,
      address.city,
      address.state,
      address.country,
      address.additionalInformation
    );
  }
}
