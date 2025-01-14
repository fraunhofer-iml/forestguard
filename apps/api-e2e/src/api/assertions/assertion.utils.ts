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

import { HttpStatus } from '@nestjs/common';

export function ensureException(err, message: string) {
  expect(err.response.data.status).toBe(HttpStatus.BAD_REQUEST);
  expect(err.response.data.timestamp).toBeDefined();
  expect(err.response.data.message).toBe(message);
  expect(err.response.data.requestDetails).toBeDefined();
}
