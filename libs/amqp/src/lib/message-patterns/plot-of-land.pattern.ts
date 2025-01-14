/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PlotOfLandMessagePatterns {
  CREATE = '/plots-of-land/create',
  READ_ALL = '/plots-of-land/read-all',
  READ_BY_ID = '/plots-of-land/read-by-id',
  UPDATE_BY_ID = '/plots-of-land/update-by-id',
  CREATE_BY_ID_PROOF = '/plots-of-land/create-by-id-proof',
  READ_BY_ID_PROOFS = '/plots-of-land/read-by-id-proofs',
}
