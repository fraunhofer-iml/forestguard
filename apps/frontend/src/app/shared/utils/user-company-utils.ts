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
