/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyDto, farmer1Mock, Role, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Messages } from '../../../shared/messages';
import { CompanyService } from '../../../shared/services/company/company.service';
import { ImportService } from '../../../shared/services/import/import.service';
import { DataTableUtilityService } from '../../../shared/utils/data-table-utility.service';
import { CompanyComponent } from './company.component';

jest.mock('ngx-sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const COMPANY_DTO_MOCK: CompanyDto = {
  id: 'c1c1f27f-75c9-45f8-98f6-cff1357561e1',
  name: 'Acme Corp',
  address: {
    id: 'ctest201',
    street: '123 Main St',
    postalCode: '62704',
    city: 'Springfield',
    state: 'IL',
    country: 'USA',
    additionalInformation: 'good to know',
  },
  employees: [],
  farmers: [
    {
      id: 'ctest102',
      employeeId: 'EID23456789',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      mobilePhoneNumber: '555-123-4567',
      role: 'FARMER',
      personalId: 'PID12345678',
      address: {
        id: 'ctest202',
        street: '456 Elm St',
        postalCode: '46176',
        city: 'Shelbyville',
        state: 'IN',
        country: 'USA',
        additionalInformation: 'good to know',
      },
      plotsOfLand: [],
    },
  ],
};

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let mockCompanyService: { getCompanyById: jest.Mock };
  let mockImportService: jest.Mocked<ImportService>;
  let dataTableUtilityServiceMock: jest.Mocked<DataTableUtilityService>;

  beforeEach(async () => {
    mockCompanyService = {
      getCompanyById: jest.fn(),
    };

    mockImportService = {
      importMasterData: jest.fn().mockReturnValue(of(null)),
    } as unknown as jest.Mocked<ImportService>;

    dataTableUtilityServiceMock = {
      pathDataAccessor: jest.fn(),
      filterPredicate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [CompanyComponent],
      providers: [
        DataTableUtilityService,
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: ImportService, useValue: mockImportService },
        HttpClient,
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of('1'),
          },
        },
        {
          provide: AuthenticationService,
          useValue: {
            getCurrentCompanyId: jest.fn().mockReturnValue(''),
            hasRole: jest.fn().mockReturnValue(Role.COOPERATIVE),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct company data', (done) => {
    mockCompanyService.getCompanyById.mockReturnValue(of(COMPANY_DTO_MOCK));
    fixture.detectChanges();

    component.farmers$?.subscribe((dataSource) => {
      expect(dataSource.data.length).toBe(1);
      expect(dataSource.data[0].firstName).toBe('John');
      done();
    });
  });

  it('should set paginator for dataSource', () => {
    const paginator = {} as MatPaginator;
    component.matPaginator = paginator;
    component.dataSource.data = [farmer1Mock];

    expect(component.dataSource.paginator).toBe(paginator);
  });

  it('should call importService with the selected file and show success toast', () => {
    const file = new File(['file content'], 'file.xlsx', { type: 'application/xlsx' });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as Event;

    component.onFileSelected(event);
    expect(mockImportService.importMasterData).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(Messages.successMasterDataImport);
  });

  it('should return formatted name with first and last name', () => {
    const item: UserOrFarmerDto = new UserOrFarmerDto('', '', 'John', 'Doe', '', '', '');
    const result = (component as any).getFormattedName(item);
    expect(result).toBe('john doe');
  });

  it('should return john doe, when path is name', () => {
    const userOrFarmerDtoMock = new UserOrFarmerDto('', '', 'John', 'Doe', '', '', '');
    dataTableUtilityServiceMock.pathDataAccessor = jest.fn().mockReturnValue('value');
    component.setDataSourceAttributes();
    const sortingDataAccessor = component.dataSource.sortingDataAccessor;
    const result = sortingDataAccessor(userOrFarmerDtoMock, 'name');
    expect(result).toBe('john doe');
  });
});
