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

import { ProofType } from '@forest-guard/api-interfaces';
import { Proof } from '@prisma/client';

const PROOF_PRISMA_MOCK: Proof = {
  documentId: '2',
  type: ProofType.PROOF_OF_FREEDOM,
  documentRef: '1-1-1-1-1.pdf',
  notice: 'This land is certified organic.',
  plotOfLandId: '1',
};

export { PROOF_PRISMA_MOCK };
