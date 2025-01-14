/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddUserComponent } from './add/add-user.component';
import { FarmerComponent } from './farmer/farmer.component';

export const userRoutes: Route[] = [
  {
    path: 'add',
    component: AddUserComponent,
  },
  {
    path: ':id',
    component: FarmerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
