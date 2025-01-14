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

import { Address, Batch, Company, Cultivation, Document, Entity, PlotOfLand, Process, ProcessStep, Proof, User } from '@prisma/client';

export type BatchWithRelations = Batch & {
  recipient: EntityWithRelations;
  processStep: ProcessStepWithRelations;
};

export type ProcessStepWithRelations = ProcessStep & {
  process: Process;
  recordedBy: EntityWithRelations;
  executedBy: EntityWithRelations;
  documents: Document[];
  farmedLand: PlotOfLandWithRelations;
};

export type EntityWithRelations = Entity & {
  company?: CompanyWithRelations | null;
  user?: UserWithRelations | null;
};

export type UserWithRelations = User & {
  address: Address;
};

export type CompanyWithRelations = Company & {
  address: Address;
};

export type PlotOfLandWithRelations = PlotOfLand & {
  cultivatedWith: Cultivation;
  proofs: Proof[];
};

export type BatchWithInAndOut = BatchWithRelations & {
  ins: Batch[];
  outs: Batch[];
};
