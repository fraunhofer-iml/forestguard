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

import { UserOrFarmerDto } from '.';
import { AddressDto } from './address.dto';
import { UserDto } from './user.dto';

export class CompanyDto {
  id: string;
  name: string;
  address: AddressDto;
  employees?: UserDto[];
  farmers?: UserOrFarmerDto[];

  constructor(id: string, name: string, address: AddressDto, employees?: UserDto[], farmers?: UserOrFarmerDto[]) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.employees = employees;
    this.farmers = farmers;
  }
}
