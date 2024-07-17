import { toast } from 'ngx-sonner';
import { catchError, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Messages } from '../../../shared/messages';
import { CompanyService } from '../../../shared/services/company/company.service';
import { AddCompanyComponent } from './add-company.component';
import { AddCompanyService } from './service/add-company.service';

describe('AddCompanyComponent', () => {
  let component: AddCompanyComponent;
  let fixture: ComponentFixture<AddCompanyComponent>;
  let companyService: jest.Mocked<CompanyService>;
  let createCompanyService: jest.Mocked<AddCompanyService>;

  beforeEach(async () => {
    const companyServiceMock = {
      createCompany: jest.fn(),
    };
    const createCompanyServiceMock = {
      createNewCompany: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [AddCompanyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: CompanyService, useValue: companyServiceMock },
        { provide: AddCompanyService, useValue: createCompanyServiceMock },
        HttpClient,
        HttpHandler,
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    companyService = TestBed.inject(CompanyService) as jest.Mocked<CompanyService>;
    createCompanyService = TestBed.inject(AddCompanyService) as jest.Mocked<AddCompanyService>;
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should submit company', () => {
    const mockCompany = of({});

    component.companyFormGroup = new FormBuilder().group({
      name: ['Example Name', []],
      state: ['Example State', []],
      country: ['Example Country', []],
      street: ['Example Street', []],
      postalCode: ['Example PostalCode', []],
      city: ['Example City', []],
    });

    createCompanyService.generateCompany = jest.fn().mockReturnValue(of({ name: 'Example Name' }));
    companyService.createCompany = jest.fn().mockReturnValue(mockCompany);

    component.submitCompany();
    expect(companyService.createCompany).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(component.companyFormGroup.value).toEqual({
      city: null,
      country: null,
      name: null,
      postalCode: null,
      state: null,
      street: null,
    });
  });

  it('should handle error if company creation fails', () => {
    const errorResponse = { status: 409 };
    const newCompany$ = throwError(errorResponse);

    component.submitCompany();
    expect(component.loading).toBe(false);
    newCompany$
      .pipe(
        catchError((error: HttpErrorResponse) => {
          expect(toast.error).toHaveBeenCalledWith(error.error.error);
          expect(component.loading).toBe(false);
          return of({});
        })
      )
      .subscribe();
  });
});
