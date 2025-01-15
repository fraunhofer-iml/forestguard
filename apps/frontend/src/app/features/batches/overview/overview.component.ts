/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchDto, Role } from '@forest-guard/api-interfaces';
import { map, Observable, tap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { Uris } from '../../../shared/uris';
import { DataTableUtilityService } from '../../../shared/utils/data-table-utility.service';
import { getUserOrCompanyName } from '../../../shared/utils/user-company-utils';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class BatchOverviewComponent implements AfterViewInit {
  displayedColumnsOfBatches: string[] = [
    'select',
    'status',
    'batchId',
    'process',
    'dateOfProcess',
    'dateOfEntry',
    'processOwner',
    'weight',
  ];
  dataSource: MatTableDataSource<BatchDto> = new MatTableDataSource<BatchDto>();
  selection = new SelectionModel<BatchDto>(true, []);
  paginator?: MatPaginator;
  sort?: MatSort;
  batches$?: Observable<MatTableDataSource<BatchDto>>;
  getUserOrCompanyName = getUserOrCompanyName;
  protected readonly Uris = Uris;
  protected readonly Role = Role;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    readonly authenticationService: AuthenticationService,
    private readonly companyService: CompanyService,
    private readonly router: Router,
    private readonly dataTableUtilityService: DataTableUtilityService
  ) {}

  ngAfterViewInit(): void {
    this.getBatches();
    this.dataSource.sortingDataAccessor = this.dataTableUtilityService.pathDataAccessor;
    this.dataSource.filterPredicate = this.dataTableUtilityService.filterPredicate;
  }

  getBatches() {
    this.batches$ = this.companyService
      .getBatchesOfCompany(this.authenticationService.getCurrentCompanyId() ?? '', '{"active": true}')
      .pipe(
        map((batches) => {
          const dataSource = this.dataSource;
          dataSource.data = batches;
          return dataSource;
        })
      );
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BatchDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  routeToAddProcess(): void {
    const selectedBatchesString = this.selection.selected.map((batch) => batch.id).join(',');
    this.router.navigateByUrl(`/batches/update?batchIds=${selectedBatchesString}`);
  }
}
