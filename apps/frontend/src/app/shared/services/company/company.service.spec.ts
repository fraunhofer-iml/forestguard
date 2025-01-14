/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyCreateDto, CompanyDto, ProcessDisplayDto, RoleType } from '@forest-guard/api-interfaces';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CompanyService } from './company.service';

describe('CompanyService', (): void => {
  let service: CompanyService;
  let companyId: string;
  let companyCreate: CompanyCreateDto;
  let company: CompanyDto;
  let processDisplay: ProcessDisplayDto;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [CompanyService, HttpClient, HttpHandler],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(CompanyService);
    companyId = '0de044f0-bc57-495f-94c1-12ddb4fd05a1';
    companyCreate = {
      name: 'Company1',
      address: {
        street: 'Example Street',
        postalCode: '12345',
        city: 'Example City',
        state: 'Example State',
        country: 'Example Country',
        additionalInformation: 'Example AdditionalInformation',
      },
    };

    company = {
      id: '0de044f0-bc57-495f-94c1-12ddb4fd05a1',
      name: 'Company1',
      address: {
        id: '29c4fb09-5e9d-46c1-ae24-accfe13570ac',
        street: 'Example Street',
        postalCode: '12345',
        city: 'Example City',
        state: 'Example State',
        country: 'Example Country',
        additionalInformation: 'Example AdditionalInformation',
      },
      employees: [],
      farmers: [],
    };

    processDisplay = {
      coffeeBatches: [
        {
          id: '',
          active: false,
          weight: 100,
          recipient: {
            address: {
              id: '29c4fb09-5e9d-46c1-ae24-accfe13570ac',
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
                id: '29c4fb09-5e9d-46c1-ae24-accfe13570ac',
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
                id: '29c4fb09-5e9d-46c1-ae24-accfe13570ac',
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
        },
      ],
      edges: [
        {
          from: '8918e6b7-e288-4f95-bc87-9d8530e66ad1',
          to: 'baa546c7-70be-4769-9723-d8e991c09aec',
        },
      ],
    };
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should create a company', () => {
    service.createCompany(companyCreate).subscribe((res) => {
      expect(res).toEqual(company);
    });
  });

  it('should get company by id', () => {
    service.getCompanyById(companyId).subscribe((res) => {
      expect(res).toEqual(company);
    });
  });

  it('should get batches by company id with query', () => {
    const query = 'query';

    service.getBatchesOfCompany(companyId, query).subscribe((res) => {
      expect(res).toEqual(processDisplay);
    });
  });

  it('should get batches by company id without query', () => {
    service.getBatchesOfCompany(companyId).subscribe((res) => {
      expect(res).toEqual(processDisplay);
    });
  });
});
