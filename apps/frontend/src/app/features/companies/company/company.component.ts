/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyDto, Role, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { BehaviorSubject, catchError, EMPTY, map, Observable, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Messages } from '../../../shared/messages';
import { CompanyService } from '../../../shared/services/company/company.service';
import { ImportService } from '../../../shared/services/import/import.service';
import { Uris } from '../../../shared/uris';
import { DataTableUtilityService } from '../../../shared/utils/data-table-utility.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
})
export class CompanyComponent {
  reload$ = new BehaviorSubject(undefined);
  id$ = this.route.params.pipe(map((params) => params['id']));
  company$: Observable<CompanyDto> = this.id$.pipe(
    switchMap((id) =>
      this.companyService.getCompanyById(id).pipe(
        catchError((error: HttpErrorResponse) => {
          toast.error(error.error.message);
          return EMPTY;
        })
      )
    )
  );
  displayedColumnsOfBatches: string[] = [
    'employeeId',
    'name',
    'email',
    'mobilePhoneNumber',
    'street',
    'postalCode',
    'city',
    'state',
    'country',
    'plotOfLand',
  ];
  dataSource: MatTableDataSource<UserOrFarmerDto> = new MatTableDataSource<UserOrFarmerDto>();
  farmers$?: Observable<MatTableDataSource<UserOrFarmerDto>>;
  paginator?: MatPaginator;
  sort?: MatSort;

  protected readonly Uris = Uris;
  protected readonly Role = Role;

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  constructor(
    readonly authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private readonly companyService: CompanyService,
    private readonly importService: ImportService,
    private readonly dataTableUtilityService: DataTableUtilityService
  ) {
    this.getFarmers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
    this.dataSource.sortingDataAccessor = (userOrFarmerDto, path) => {
      if (path === 'name') {
        return this.getFormattedName(userOrFarmerDto);
      }
      return this.dataTableUtilityService.pathDataAccessor(userOrFarmerDto, path);
    };

    this.dataSource.filterPredicate = this.dataTableUtilityService.filterPredicate;
  }

  getFarmers() {
    this.farmers$ = this.reload$.pipe(
      switchMap(() =>
        this.company$.pipe(
          map((company) => {
            this.dataSource = new MatTableDataSource<UserOrFarmerDto>(company.farmers ?? []);
            return this.dataSource;
          })
        )
      )
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const formData = new FormData();
      formData.append('file', input.files[0]);
      this.importService
        .importMasterData(formData)
        .pipe(
          catchError(() => {
            toast.error(Messages.errorMasterDataImport);
            return EMPTY;
          })
        )
        .subscribe(() => {
          this.reload$.next(undefined);
          toast.success(Messages.successMasterDataImport);
        });
    }
  }

  private getFormattedName(userOrFarmerDto: UserOrFarmerDto): string {
    const firstName = userOrFarmerDto.firstName ? userOrFarmerDto.firstName : '';
    const lastName = userOrFarmerDto.lastName ? userOrFarmerDto.lastName : '';
    return `${firstName} ${lastName}`.toLowerCase().trim();
  }
}
