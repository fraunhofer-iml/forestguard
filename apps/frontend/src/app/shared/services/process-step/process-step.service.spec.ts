/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { Uris } from '../../uris';
import { ProcessStepService } from './process.step.service';

describe('ProcessStepService', (): void => {
  let service: ProcessStepService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProcessStepService],
    }).compileComponents();

    service = TestBed.inject(ProcessStepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to upload a document', () => {
    const userId = '12345';
    const file = new File(['content'], 'testfile.txt', { type: 'application/json' });
    const description = 'Test description';

    const mockDocument = {
      id: '1',
      name: 'testfile.txt',
      description: 'Test description',
    };

    service.addDocToProcessStep(userId, file, description).subscribe((document) => {
      expect(document).toEqual(mockDocument);
    });

    const req = httpMock.expectOne(`${environment.PROCESSSTEPS.URL}/${userId}${Uris.document}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.has('file')).toBeTruthy();
    expect(req.request.body.has('description')).toBeTruthy();
    req.flush(mockDocument);
  });
});
