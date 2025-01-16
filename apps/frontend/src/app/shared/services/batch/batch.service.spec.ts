/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchCreateDto, BatchDto, ProcessDto } from '@forest-guard/api-interfaces';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BatchService } from './batch.service';

describe('BatchService', (): void => {
  let service: BatchService;
  let batchesCreateMock: BatchCreateDto[];
  let processMock: ProcessDto;
  let batchMock: BatchDto;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [BatchService, HttpClient, HttpHandler],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(BatchService);
    batchesCreateMock = [
      {
        euInfoSystemId: 'EU Info',
        ins: ['string'],
        weight: 0,
        recipient: 'string',
        processStep: {
          location: 'location',
          dateOfProcess: '2024-05-12T13:08:44.247Z',
          process: 'string',
          recordedBy: 'string',
          executedBy: 'string',
          harvestedLand: 'string',
        },
      },
    ];

    processMock = {
      id: 'ojsopp9485cm4305930',
      name: 'Process 1',
    };

    batchMock = {
      id: '8918e6b7-e288-4f95-bc87-9d8530e66ad1',
      euInfoSystemId: 'EU Info',
      weight: 0,
      active: true,
      recipient: {
        id: 'ad56553a-fe56-4dbe-8d6d-e6a101b0255b',
        employeeId: '1',
        firstName: 'Morgan',
        lastName: 'Hall',
        email: 'user@example.com',
        role: 'EMPLOYEE',
        mobilePhoneNumber: '+5114841700',
      },
      processStep: {
        id: '6eb8e77c-cc08-44de-9b7a-2cdfc9387e7d',
        location: 'location',
        dateOfProcess: new Date('2024-05-12T13:08:44.247Z'),
        dateOfEntry: new Date('2024-05-13T13:08:44.247Z'),
        process: {
          id: 'eec06f70-ab67-49c5-a82b-ffcbff53229a',
          name: 'Process 1',
        },
        recordedBy: {
          id: 'ad56553a-fe56-4dbe-8d6d-e6a101b0255b',
          employeeId: '1',
          firstName: 'Morgan',
          lastName: 'Hall',
          email: 'user@example.com',
          role: 'EMPLOYEE',
          mobilePhoneNumber: '+5114841700',
        },
        executedBy: {
          id: 'ad56553a-fe56-4dbe-8d6d-e6a101b0255b',
          employeeId: '1',
          firstName: 'Morgan',
          lastName: 'Hall',
          email: 'user@example.com',
          role: 'EMPLOYEE',
          mobilePhoneNumber: '+5114841700',
        },
      },
    };
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should create batches', () => {
    service.createBatches(batchesCreateMock).subscribe((res) => {
      expect(res).toEqual(processMock);
    });
  });

  it('should get batch by id', () => {
    const id = '0de044f0-bc57-495f-94c1-12ddb4fd05a1';
    service.getBatchById(id).subscribe((res) => {
      expect(res).toEqual(batchMock);
    });
  });

  it('should create Harvest Batches', () => {
    service.createHarvestBatches(batchesCreateMock).subscribe((res) => {
      expect(res).toEqual(processMock);
    });
  });
});
