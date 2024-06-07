import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BatchService } from './services/batch/batch.service';
import { CompanyService } from './services/company/company.service';
import { PlotOfLandService } from './services/plotOfLand/plotOfLand.service';
import { UserService } from './services/user/user.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [provideHttpClient(), CompanyService, BatchService, PlotOfLandService, UserService],
})
export class SharedModule {}
