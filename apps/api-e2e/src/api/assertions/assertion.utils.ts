/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpStatus } from '@nestjs/common';

export function ensureException(err, message: string) {
  expect(err.response.data.status).toBe(HttpStatus.BAD_REQUEST);
  expect(err.response.data.timestamp).toBeDefined();
  expect(err.response.data.message).toBe(message);
  expect(err.response.data.requestDetails).toBeDefined();
}
