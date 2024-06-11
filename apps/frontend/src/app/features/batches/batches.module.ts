import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BatchService } from '../../shared/services/batch/batch.service';
import { CompanyService } from '../../shared/services/company/company.service';
import { SharedModule } from '../../shared/shared.module';
import { TypeSafeMatCellDefDirective } from '../../shared/utils/typesafe-matcell.definition';
import { BatchesRoutingModule } from './batches.routes';
import { BatchDetailsComponent } from './details/details.component';
import { HarvestComponent } from './harvest/harvest.component';
import { HarvestService } from './harvest/service/harvest.service';
import { BatchOverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [BatchOverviewComponent, TypeSafeMatCellDefDirective, BatchDetailsComponent, HarvestComponent],
  imports: [
    CommonModule,
    BatchesRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    SharedModule,
    ReactiveFormsModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  providers: [CompanyService, BatchService, MatDatepickerModule, HarvestService],
})
export class BatchesModule {}
