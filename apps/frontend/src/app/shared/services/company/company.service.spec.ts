import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from "@angular/common/http";
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CompanyService } from './company.service';
import { CompanyDto, ProcessDisplayDto } from '@forrest-guard/api-interfaces';

describe('CompanyService', (): void => {
  let service: CompanyService;
  let companyId: string;
  let companyCreate: CompanyDto;
  let company: CompanyDto;
  let processDisplay: ProcessDisplayDto;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        CompanyService,
        HttpClient,
        HttpHandler
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(CompanyService);
    companyId = '0de044f0-bc57-495f-94c1-12ddb4fd05a1';
    companyCreate = {
      id: '0de044f0-bc57-495f-94c1-12ddb4fd05a1',
      name: 'Company1',
      address: {
        street: 'Example Street',
        postalCode: '12345',
        city: 'Example City',
        state: 'Example State',
        country: 'Example Country'
      },
      employees: [],
      farmers: []
    };

    company = {
      id: '0de044f0-bc57-495f-94c1-12ddb4fd05a1',
      name: 'Company1',
      address: {
        street: 'Example Street',
        postalCode: '12345',
        city: 'Example City',
        state: 'Example State',
        country: 'Example Country'
      },
      employees: [],
      farmers: []
    };

    processDisplay = {
      coffeeBatches: [
        {
          id: '5122ea21-c437-4458-9102-279111269703',
          weight: 0,
          recipient: '13c9913c-d324-43d1-b834-f536a9e0453c',
          processStep: {
            id: '0e66ad1',
            location: 'location',
            date: new Date('2024-05-13T13:08:44.247Z'),
            process: {
              id: '',
              name: 'harvest',
            },
            executedBy: {
              id: '9d8530e66ad1',
              employeeId: '8918e6b71',
              firstName: 'Pascal',
              lastName: 'Lohse',
              email: 'string',
              role: 'USER',
              mobilePhoneNumber: '348934000'
            },
          }
        }
      ],
      edges: [
        {
          from: '8918e6b7-e288-4f95-bc87-9d8530e66ad1',
          to: 'baa546c7-70be-4769-9723-d8e991c09aec'
        }
      ]
    }
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should create a company', () => {
    service.createCompany(companyCreate).subscribe(res => {
      expect(res).toEqual(company);
    });
  });

  it('should get company by id', () => {
    service.getCompanyById(companyId).subscribe(res => {
      expect(res).toEqual(company);
    });
  });

  it('should get batches by company id with query', () => {
    const query = 'query';

    service.getBatchesOfCompany(companyId, query).subscribe(res => {
      expect(res).toEqual(processDisplay);
    });
  });

  it('should get batches by company id without query', () => {
    service.getBatchesOfCompany(companyId).subscribe(res => {
      expect(res).toEqual(processDisplay);
    });
  })
});



