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
