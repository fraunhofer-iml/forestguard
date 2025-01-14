/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
