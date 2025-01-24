/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { Address, User } from '@prisma/client';
import { PlotOfLandWithRelations } from '../company/company.types';

export function toUserDto(user: User): UserDto | null {
  if (!user) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { entityId, companyId, addressId, personalId, ...cleanedUser } = user;
  return cleanedUser;
}

export function toUserOrFarmerDto(user: User & { address: Address; plotsOfLand?: PlotOfLandWithRelations[] }): UserOrFarmerDto | null {
  if (!user) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { entityId, companyId, addressId, ...cleanedUser } = user;
  return cleanedUser;
}
