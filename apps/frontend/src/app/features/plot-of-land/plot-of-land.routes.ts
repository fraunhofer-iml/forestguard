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

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddPlotOfLandComponent } from './add/add-plot-of-land.component';
import { PlotOfLandDetailsComponent } from './details/details.component';

export const plotOfLandRoutes: Route[] = [
  {
    path: '',
    component: AddPlotOfLandComponent,
  },
  {
    path: ':id',
    component: PlotOfLandDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(plotOfLandRoutes)],
  exports: [RouterModule],
})
export class PlotOfLandRoutingModule {}
