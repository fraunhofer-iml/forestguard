import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../shared/shared.module';
import { PlotOfLandComponent } from './plot-of-land.component';
import { PlotOfLandRoutingModule } from './plot-of-land.routes';
import { GeneratePlotOfLandService } from './service/generate-plot-of-land.service';

@NgModule({
  declarations: [PlotOfLandComponent],
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
  ],
  providers: [GeneratePlotOfLandService],
})
export class PlotOfLandModule {}
