/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { CompanyService } from '../../shared/services/company/company.service';
import { ImportService } from '../../shared/services/import/import.service';
import { TypeSafeMatCellDefDirective } from '../../shared/services/utils/typesafe-matcell.definition';
import { SharedModule } from '../../shared/shared.module';
import { DataTableUtilityService } from '../../shared/utils/data-table-utility.service';
import { AddCompanyComponent } from './add-company/add-company.component';
import { AddCompanyService } from './add-company/service/add-company.service';
import { CompaniesRoutingModule } from './companies.routes';
import { CompanyComponent } from './company/company.component';

@NgModule({
  declarations: [AddCompanyComponent, CompanyComponent, TypeSafeMatCellDefDirective],
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SharedModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCell,
    MatCellDef,
    MatCheckbox,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    MatTooltip,
  ],
  providers: [
    CompanyService,
    AddCompanyService,
    ImportService,
    DataTableUtilityService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
  ],
})
export class CompaniesModule {}
