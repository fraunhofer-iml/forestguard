/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AddressCreateDto,
  AddressDto,
  FarmerCreateDto,
  UserDto,
  UserOrFarmerDto,
  UserCreateDto,
} from '@forest-guard/api-interfaces';

export const userNotFoundMessage = 'No User found';

export function ensureUser(actualUser: UserDto, expectedUser: UserCreateDto) {
  expect(actualUser.employeeId).toEqual(expectedUser.employeeId);
  expect(actualUser.firstName).toEqual(expectedUser.firstName);
  expect(actualUser.lastName).toEqual(expectedUser.lastName);
  expect(actualUser.email).toEqual(expectedUser.email);
  expect(actualUser.role).toEqual(expectedUser.role);
  expect(actualUser.mobilePhoneNumber).toEqual(expectedUser.mobilePhoneNumber);
}

export function ensureUsers(actualUsers: UserDto[], ...expectedUsers: UserCreateDto[]) {
  expect(actualUsers.length).toBe(expectedUsers.length);
  for (let i = 0; i < expectedUsers.length; i++) {
    ensureUser(actualUsers[i], expectedUsers[i]);
  }
}

export function ensureFarmer(actualFarmer: UserOrFarmerDto, expectedFarmer: FarmerCreateDto) {
  ensureUser(actualFarmer, expectedFarmer);
  expect(actualFarmer.personalId).toEqual(expectedFarmer.personalId);
  ensureAddress(actualFarmer.address, expectedFarmer.address);
}

function ensureAddress(actualAddress: AddressDto, expectedAddress: AddressCreateDto) {
  expect(actualAddress.id).toBeTruthy();
  expect(actualAddress.street).toBe(expectedAddress.street);
  expect(actualAddress.postalCode).toBe(expectedAddress.postalCode);
  expect(actualAddress.city).toBe(expectedAddress.city);
  expect(actualAddress.state).toBe(expectedAddress.state);
  expect(actualAddress.country).toBe(expectedAddress.country);
}
