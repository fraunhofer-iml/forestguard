/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserMessagePatterns {
  CREATE = '/users/create',
  READ_ALL = '/users/read-all',
  READ_BY_ID = '/users/read-by-id',
  UPDATE_BY_ID = '/users/update-by-id',
  CREATE_FARMER = '/users/create-farmer',
  READ_FARMER_BY_COMPANY_ID = '/users/read-farmer-by-company-id',
}
