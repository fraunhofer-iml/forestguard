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

import { PlotOfLandDto } from '../plot-of-land';
import { AddressDto } from './address.dto';
import { UserDto } from './user.dto';

/**
 * @deprecated Will be removed in favor of UserOrFarmerDto
 */
export class FarmerDto extends UserDto {
  personalId: string;
  address: AddressDto;
  plotsOfLand?: PlotOfLandDto[];

  constructor(
    id: string,
    employeeId: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    mobilePhoneNumber: string,
    personalId: string,
    address: AddressDto,
    plotsOfLand?: PlotOfLandDto[]
  ) {
    super(id, employeeId, firstName, lastName, email, role, mobilePhoneNumber);
    this.personalId = personalId;
    this.address = address;
    this.plotsOfLand = plotsOfLand;
  }
}
