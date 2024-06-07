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
import { TypeSafeMatCellDefDirective } from '../../shared/services/utils/typesafe-matcell.definition';
import { SharedModule } from '../../shared/shared.module';
import { OverviewComponent } from './overview.component';
import { OverviewRoutingModule } from './overview.routes';

@NgModule({
  declarations: [OverviewComponent, TypeSafeMatCellDefDirective],
  imports: [
    CommonModule,
    OverviewRoutingModule,
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
export class OverviewModule {}
