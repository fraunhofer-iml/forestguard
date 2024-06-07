import { BatchDto, CompanyDto } from '@forrest-guard/api-interfaces';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Role } from '@prisma/client';
import { CompanyService } from '../../shared/services/company/company.service';
import { OverviewComponent } from './overview.component';

const MOCK_BATCH: BatchDto = {
  id: '',
  active: false,
  weight: 100,
  recipient: {
    address: {
      city: 'test',
      country: 'test',
      postalCode: 'test',
      state: 'test',
      street: 'test',
    },
    email: 'test',
    employeeId: 'test',
    firstName: 'test',
    id: 'test',
    lastName: 'test',
    mobilePhoneNumber: 'test',
    role: Role.EMPLOYEE,
    name: 'test',
  },
  processStep: {
    date: new Date(),
    id: 'test',
    process: {
      id: 'test',
      name: 'test',
    },
    executedBy: {
      address: {
        city: 'test',
        country: 'test',
        postalCode: 'test',
        state: 'test',
        street: 'test',
      },
      email: 'test',
      employeeId: 'test',
      firstName: 'test',
      id: 'test',
      lastName: 'test',
      mobilePhoneNumber: 'test',
      role: Role.EMPLOYEE,
      name: 'test',
    },
    location: 'test',
    farmedLand: {
      description: 'test',
    },
    recordedBy: {
      address: {
        city: 'test',
        country: 'test',
        postalCode: 'test',
        state: 'test',
        street: 'test',
      },
      email: 'test',
      employeeId: 'test',
      firstName: 'test',
      id: 'test',
      lastName: 'test',
      mobilePhoneNumber: 'test',
      role: Role.EMPLOYEE,
      name: 'test',
    },
  },
};
describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let companyService: jest.Mocked<CompanyService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [OverviewComponent],
      providers: [
        {
          provide: CompanyService,
          useValue: {
            getBatchesOfCompany: jest.fn(),
          },
        },
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    companyService = TestBed.inject(CompanyService) as jest.Mocked<CompanyService>;
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

  it('pathDataAccessor should return nested property', () => {
    const item = { a: { b: 'test' } };
    const result = component.pathDataAccessor(item, 'a.b');
    expect(result).toEqual('test');
  });

  it('filterPredicate should return true if filter string is found', () => {
    const result = component.filterPredicate(MOCK_BATCH, 'test');
    expect(result).toBeTruthy();
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
      role: Role.EMPLOYEE,
      name: 'test',
    };
    const company: CompanyDto = {
      name: 'Test Company',
      id: 'test',
      address: {
        city: 'test',
        country: 'test',
        postalCode: 'test',
        state: 'test',
        street: 'test',
      },
    };
    expect(component.getUserOrCompanyName(user)).toEqual('John Doe');
    expect(component.getUserOrCompanyName(company)).toEqual('Test Company');
  });
});
