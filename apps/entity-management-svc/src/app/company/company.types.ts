/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

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
