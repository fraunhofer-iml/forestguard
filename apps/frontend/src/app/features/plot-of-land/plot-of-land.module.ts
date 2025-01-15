/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PlotOfLandService } from '../../shared/services/plotOfLand/plotOfLand.service';
import { SharedModule } from '../../shared/shared.module';
import { AddPlotOfLandComponent } from './add/add-plot-of-land.component';
import { CoordinateInputComponent } from './add/components/coordinate-input/coordinate-input.component';
import { GeneratePlotOfLandService } from './add/service/generate-plot-of-land.service';
import { PlotOfLandDetailsComponent } from './details/details.component';
import { PlotOfLandRoutingModule } from './plot-of-land.routes';

@NgModule({
  declarations: [AddPlotOfLandComponent, PlotOfLandDetailsComponent, CoordinateInputComponent],
  imports: [
    PlotOfLandRoutingModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatCardModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule,
    LeafletModule,
    ClipboardModule,
  ],
  providers: [GeneratePlotOfLandService, PlotOfLandService],
})
export class PlotOfLandModule {}
