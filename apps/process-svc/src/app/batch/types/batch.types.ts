/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
