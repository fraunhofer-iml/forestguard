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
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { BatchDetailsComponent } from './details/details.component';
import { HarvestComponent } from './harvest/harvest.component';
import { BatchOverviewComponent } from './overview/overview.component';
import { BatchUpdateComponent } from './update/batch-update.component';

export const batchesRoutes: Route[] = [
  {
    path: '',
    component: BatchOverviewComponent,
  },
  {
    path: 'harvest',
    component: HarvestComponent,
    canActivate: [roleGuard],
    data: { roles: [Role.COOPERATIVE] },
  },
  {
    path: 'update',
    component: BatchUpdateComponent,
  },
  {
    path: ':id',
    component: BatchDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(batchesRoutes)],
  exports: [RouterModule],
})
export class BatchesRoutingModule {}
