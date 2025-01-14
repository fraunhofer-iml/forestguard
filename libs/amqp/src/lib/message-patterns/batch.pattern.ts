/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export enum BatchMessagePatterns {
  CREATE = '/batches/create',
  CREATE_HARVESTS = '/batches/create-harvests',
  CREATE_COMBINED_HARVESTS = '/batches/create-combined-harvests',
  READ_BY_ID = '/batches/read-by-id',
  READ_BY_ID_RELATED = '/batches/read-by-id-related',
  READ_EXPORT = '/batches/read-export'
}
