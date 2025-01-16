/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyDto, UserDto } from '@forest-guard/api-interfaces';

/**
 * Gets the name of the user or company
 * @param input The data to get the name from
 * @returns The name of the user or company
 */
export const getUserOrCompanyName = (input: UserDto | CompanyDto | undefined): string => {
  if (!input) return '';
  if ((input as UserDto).firstName) {
    input = input as UserDto;
    return `${input.firstName} ${input.lastName}`;
  }
  if ((input as UserDto).lastName) {
    input = input as UserDto;
    return `${input.lastName}`;
  }
  if ((input as CompanyDto).name) return (input as CompanyDto).name;
  return '';
};

export const getFormattedUserName = (user: { firstName?: string; lastName: string }): string => {
  return user.firstName ? `${user.lastName}, ${user.firstName}` : user.lastName;
};
