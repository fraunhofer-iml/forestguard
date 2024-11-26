import { UiGraphComponent } from '@forest-guard/ui-graph';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DiagramModule } from '@syncfusion/ej2-angular-diagrams';
import { BatchService } from '../../shared/services/batch/batch.service';
import { CompanyService } from '../../shared/services/company/company.service';
import { ProcessStepService } from '../../shared/services/process-step/process.step.service';
import { SharedModule } from '../../shared/shared.module';
import { DataTableUtilityService } from '../../shared/utils/data-table-utility.service';
import { TypeSafeMatCellDefDirective } from '../../shared/utils/typesafe-matcell.definition';
import { BatchesRoutingModule } from './batches.routes';
import { BatchDetailsComponent } from './details/details.component';
import { HarvestComponent } from './harvest/harvest.component';
import { HarvestService } from './harvest/service/harvest.service';
import { BatchOverviewComponent } from './overview/overview.component';
import { BatchUpdateComponent } from './update/batch-update.component';

@NgModule({
  declarations: [
    BatchOverviewComponent,
    TypeSafeMatCellDefDirective,
    BatchDetailsComponent,
    HarvestComponent,
    BatchUpdateComponent,
    UiGraphComponent,
  ],
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
    MatCheckboxModule,
    MatTooltipModule,
    DiagramModule,
    MatIcon,
  ],
  providers: [
    CompanyService,
    BatchService,
    MatDatepickerModule,
    HarvestService,
    ProcessStepService,
    DataTableUtilityService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
  ],
})
export class BatchesModule {}
