import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HarvestComponent } from './harvest.component';
import { HarvestRoutingModule } from './harvest.routes';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { UserService } from '../../shared/services/user/user.service';
import { BatchService } from '../../shared/services/batch/batch.service';
import { HttpClientModule } from '@angular/common/http';
import { CompanyService } from '../../shared/services/company/company.service';
import { PlotOfLandService } from '../../shared/services/plotOfLand/plotOfLand.service';
import { PlotOfLandMockService } from '../../shared/services/plotOfLand/plotOfLandMock.service';
import { HarvestService } from './service/harvest.service';


@NgModule({
  declarations: [
    HarvestComponent
  ],
  imports: [
    CommonModule,
    HarvestRoutingModule,
    MatCard,
    MatFormField,
    MatSelect,
    ReactiveFormsModule,
    MatOption,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatInput,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  providers: [
    MatDatepickerModule,
    UserService,
    BatchService,
    PlotOfLandService,
    CompanyService,
    PlotOfLandMockService,
    HarvestService
  ]
})
export class HarvestModule { }
