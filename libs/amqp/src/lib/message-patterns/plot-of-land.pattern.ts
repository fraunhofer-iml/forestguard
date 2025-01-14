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

export enum PlotOfLandMessagePatterns {
  CREATE = '/plots-of-land/create',
  READ_ALL = '/plots-of-land/read-all',
  READ_BY_ID = '/plots-of-land/read-by-id',
  UPDATE_BY_ID = '/plots-of-land/update-by-id',
  CREATE_BY_ID_PROOF = '/plots-of-land/create-by-id-proof',
  READ_BY_ID_PROOFS = '/plots-of-land/read-by-id-proofs',
}
