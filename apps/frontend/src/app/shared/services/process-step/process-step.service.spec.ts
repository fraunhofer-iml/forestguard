/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
