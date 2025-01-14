/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { addCompanyGuard } from '../../core/guards/add-company.guard';
import { authGuard } from '../../core/guards/auth.guard';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompanyComponent } from './company/company.component';

export const companiesRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'id',
    pathMatch: 'full',
  },
  {
    path: 'add',
    component: AddCompanyComponent,
    canActivate: [addCompanyGuard],
  },
  {
    path: ':id',
    component: CompanyComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(companiesRoutes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
