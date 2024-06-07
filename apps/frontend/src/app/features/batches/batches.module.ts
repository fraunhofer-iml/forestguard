import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BatchService } from '../../shared/services/batch/batch.service';
import { CompanyService } from '../../shared/services/company/company.service';
import { SharedModule } from '../../shared/shared.module';
import { TypeSafeMatCellDefDirective } from '../../shared/utils/typesafe-matcell.definition';
import { BatchesRoutingModule } from './batches.routes';
import { BatchDetailsComponent } from './details/details.component';
import { BatchOverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [BatchOverviewComponent, TypeSafeMatCellDefDirective, BatchDetailsComponent],
  imports: [
    CommonModule,
    BatchesRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    SharedModule,
  ],
  providers: [CompanyService, BatchService],
})
export class BatchesModule {}
