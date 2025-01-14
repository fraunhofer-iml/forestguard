/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Role } from '@forest-guard/api-interfaces';
import { Route } from '@angular/router';
import { ContentLayoutComponent } from './core/components/content-layout/content-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UnauthorizedComponent } from './shared/pages/unauthorized/unauthorized.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'batches',
        pathMatch: 'full',
      },
      {
        path: 'batches',
        loadChildren: () => import('./features/batches/batches.module').then((m) => m.BatchesModule),
        canActivate: [authGuard],
      },
      {
        path: 'companies',
        loadChildren: () => import('./features/companies/companies.module').then((m) => m.CompaniesModule),
        canActivate: [authGuard],
      },
      {
        path: 'pols',
        loadChildren: () => import('./features/plot-of-land/plot-of-land.module').then((m) => m.PlotOfLandModule),
        canActivate: [authGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./features/user/user.module').then((m) => m.UserModule),
        canActivate: [authGuard],
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent,
      },
    ],
  },
];
