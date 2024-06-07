import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { BatchService } from '../../shared/services/batch/batch.service';
import { CompanyService } from '../../shared/services/company/company.service';
import { PlotOfLandService } from '../../shared/services/plotOfLand/plotOfLand.service';
import { PlotOfLandMockService } from '../../shared/services/plotOfLand/plotOfLandMock.service';
import { UserService } from '../../shared/services/user/user.service';
import { SharedModule } from '../../shared/shared.module';
import { HarvestComponent } from './harvest.component';
import { HarvestRoutingModule } from './harvest.routes';
import { HarvestService } from './service/harvest.service';

@NgModule({
  declarations: [HarvestComponent],
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
    MatNativeDateModule,
    MatDatepickerModule,
    SharedModule,
  ],
  providers: [MatDatepickerModule, UserService, BatchService, PlotOfLandService, CompanyService, PlotOfLandMockService, HarvestService],
})
export class HarvestModule {}
