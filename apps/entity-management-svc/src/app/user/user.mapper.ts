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

import { UserDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { Address, User } from '@prisma/client';
import { PlotOfLandWithRelations } from '../company/company.types';

export function toUserDto(user: User): UserDto {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { entityId, companyId, addressId, personalId, ...cleanedUser } = user;
  return cleanedUser;
}

export function toUserOrFarmerDto(user: User & { address: Address; plotsOfLand?: PlotOfLandWithRelations[] }): UserOrFarmerDto {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { entityId, companyId, addressId, ...cleanedUser } = user;
  return cleanedUser;
}
