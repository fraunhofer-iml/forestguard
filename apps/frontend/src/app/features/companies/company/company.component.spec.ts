import { CompanyDto, farmer1Mock } from '@forest-guard/api-interfaces';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../shared/services/company/company.service';
import { CompanyComponent } from './company.component';

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
      },
      plotsOfLand: [],
    },
  ],
};

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let mockCompanyService: { getCompanyById: jest.Mock };

  beforeEach(async () => {
    mockCompanyService = {
      getCompanyById: jest.fn(),
    };

    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [CompanyComponent],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
        HttpClient,
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of('1'),
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
});
