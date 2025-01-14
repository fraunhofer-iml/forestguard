/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchDto, CompanyDto, RoleType } from '@forest-guard/api-interfaces';
import { of } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { DataTableUtilityService } from '../../../shared/utils/data-table-utility.service';
import { BatchOverviewComponent } from './overview.component';

const MOCK_BATCH: BatchDto = {
  id: '',
  active: false,
  weight: 100,
  recipient: {
    address: {
      id: 'test',
      city: 'test',
      country: 'test',
      postalCode: 'test',
      state: 'test',
      street: 'test',
      additionalInformation: 'test',
    },
    email: 'test',
    employeeId: 'test',
    firstName: 'test',
    id: 'test',
    lastName: 'test',
    mobilePhoneNumber: 'test',
    role: RoleType.EMPLOYEE,
    name: 'test',
  },
  processStep: {
    dateOfProcess: new Date(),
    dateOfEntry: new Date(),
    id: 'test',
    process: {
      id: 'test',
      name: 'test',
    },
    executedBy: {
      address: {
        id: 'test',
        city: 'test',
        country: 'test',
        postalCode: 'test',
        state: 'test',
        street: 'test',
        additionalInformation: 'test',
      },
      email: 'test',
      employeeId: 'test',
      firstName: 'test',
      id: 'test',
      lastName: 'test',
      mobilePhoneNumber: 'test',
      role: RoleType.EMPLOYEE,
      name: 'test',
    },
    location: 'test',
    farmedLand: {
      id: 'test',
      description: 'test',
    },
    recordedBy: {
      address: {
        id: 'test',
        city: 'test',
        country: 'test',
        postalCode: 'test',
        state: 'test',
        street: 'test',
        additionalInformation: 'test',
      },
      email: 'test',
      employeeId: 'test',
      firstName: 'test',
      id: 'test',
      lastName: 'test',
      mobilePhoneNumber: 'test',
      role: RoleType.EMPLOYEE,
      name: 'test',
    },
  },
};
describe('OverviewComponent', () => {
  let component: BatchOverviewComponent;
  let fixture: ComponentFixture<BatchOverviewComponent>;
  let companyService: jest.Mocked<CompanyService>;
  let router: Router;
  let selectionModel: SelectionModel<BatchDto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [BatchOverviewComponent],
      providers: [
        DataTableUtilityService,
        {
          provide: CompanyService,
          useValue: {
            getBatchesOfCompany: jest.fn(),
          },
        },
        {
          provide: AuthenticationService,
          useValue: {
            getCurrentCompanyId: jest.fn().mockReturnValue(''),
          },
        },
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchOverviewComponent);
    component = fixture.componentInstance;
    companyService = TestBed.inject(CompanyService) as jest.Mocked<CompanyService>;
    router = TestBed.inject(Router);
    selectionModel = new SelectionModel<BatchDto>(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngAfterViewInit should initialize sorting and filtering', () => {
    jest.spyOn(companyService, 'getBatchesOfCompany').mockReturnValue(of([MOCK_BATCH]));
    component.ngAfterViewInit();
    expect(component.dataSource.sortingDataAccessor).toBeDefined();
    expect(component.dataSource.filterPredicate).toBeDefined();
  });

  it('getBatches should fetch batches from companyService', () => {
    const mockBatches = [MOCK_BATCH];
    companyService.getBatchesOfCompany.mockReturnValue(of(mockBatches));
    component.getBatches();
    expect(component.batches$).toBeDefined();
  });
  // ...

  it('setDataSourceAttributes should set paginator and sort', () => {
    component.paginator = new MatPaginator(new MatPaginatorIntl(), {} as ChangeDetectorRef);
    component.sort = new MatSort();
    component.setDataSourceAttributes();
    expect(component.dataSource.paginator).toBeDefined();
    expect(component.dataSource.sort).toBeDefined();
  });

  it('getUserOrCompanyName should return user or company name', () => {
    const user = {
      address: {
        city: 'test',
        country: 'test',
        postalCode: 'test',
        state: 'test',
        street: 'test',
      },
      email: 'test',
      employeeId: 'test',
      firstName: 'John',
      id: 'test',
      lastName: 'Doe',
      mobilePhoneNumber: 'test',
      role: RoleType.EMPLOYEE,
      name: 'test',
    };
    const company: CompanyDto = {
      name: 'Test Company',
      id: 'test',
      address: {
        id: 'test',
        city: 'test',
        country: 'test',
        postalCode: 'test',
        state: 'test',
        street: 'test',
        additionalInformation: 'test',
      },
    };
    expect(component.getUserOrCompanyName(user)).toEqual('John Doe');
    expect(component.getUserOrCompanyName(company)).toEqual('Test Company');
  });

  it('should check if elements are selected', () => {
    const mockData: BatchDto[] = [MOCK_BATCH];
    component.dataSource = new MatTableDataSource(mockData);
    component.selection = new SelectionModel<BatchDto>(true, []);

    component.selection.select(...mockData);
    expect(component.isAllSelected()).toBe(true);

    component.selection.clear();
    expect(component.isAllSelected()).toBe(false);
  });

  it('should toggle all rows selection', () => {
    const mockData: BatchDto[] = [MOCK_BATCH];
    component.dataSource = new MatTableDataSource(mockData);
    component.selection = new SelectionModel<BatchDto>(true, []);
    expect(component.selection.selected.length).toBe(0);

    component.toggleAllRows();
    expect(component.selection.selected.length).toBe(mockData.length);

    component.toggleAllRows();
    expect(component.selection.selected.length).toBe(0);
  });

  it('should return label when row is defined and selected', () => {
    const row: BatchDto = MOCK_BATCH;
    const result = component.checkboxLabel(row);

    selectionModel.select(row);
    expect(result).toBe('select');
  });

  it('should route to add process with selected batch IDs', () => {
    const mockData: BatchDto[] = [MOCK_BATCH];
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl').mockImplementation();
    const expectedBatchIds = mockData.map((batch) => batch.id).join(',');

    component.dataSource = new MatTableDataSource(mockData);
    component.selection = new SelectionModel<BatchDto>(true, mockData);

    component.routeToAddProcess();
    expect(navigateByUrlSpy).toHaveBeenCalledWith(`/batches/update?batchIds=${expectedBatchIds}`);
    navigateByUrlSpy.mockRestore();
  });

  it('should return "deselect all" when row is undefined and allSelected is true', () => {
    jest.spyOn(component, 'isAllSelected').mockReturnValue(true);

    const result = component.checkboxLabel();
    expect(result).toBe('deselect all');
  });

  it('should handle null paginator and sort', () => {
    component.paginator = undefined;
    component.sort = undefined;

    component.setDataSourceAttributes();
    expect(component.dataSource.paginator).toBeNull();
    expect(component.dataSource.sort).toBeNull();
  });

  it('should set batches$ correctly when getBatches is called', (done) => {
    jest.spyOn(companyService, 'getBatchesOfCompany').mockReturnValue(of([MOCK_BATCH]));

    component.getBatches();
    component.batches$?.subscribe((dataSource) => {
      expect(dataSource.data).toEqual([MOCK_BATCH]);
      done();
    });
  });
});
