/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
