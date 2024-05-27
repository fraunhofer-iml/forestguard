import { Address, Company, Cultivation, PlotOfLand, Proof, User } from '@prisma/client';

type CompanyWithRelations = Company & {
  address: Address;
  users: UserWithRelations[];
};

type UserWithRelations = User & {
  address: Address;
  plotsOfLand: PlotOfLandWithRelations[];
};

type PlotOfLandWithRelations = PlotOfLand & {
  cultivatedWith: Cultivation;
  proofs: Proof[];
};

export type { CompanyWithRelations, UserWithRelations, PlotOfLandWithRelations };
