import { Address, Batch, Company, Cultivation, Entity, PlotOfLand, Process, ProcessStep, Proof, User } from '@prisma/client';

export type BatchWithRelations = Batch & {
  recipient: EntityWithRelations;
  processStep: ProcessStepWithRelations;
};

export type ProcessStepWithRelations = ProcessStep & {
  process: Process;
  recordedBy: EntityWithRelations;
  executedBy: EntityWithRelations;
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
