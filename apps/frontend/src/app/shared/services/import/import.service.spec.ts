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

import { ImportResponseDto } from '@forest-guard/api-interfaces';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ImportService } from './import.service';

describe('ImportService', (): void => {
  let service: ImportService;
  let importMock: ImportResponseDto;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ImportService, HttpClient, HttpHandler],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(ImportService);
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should post master data', () => {
    const formData = new FormData();
    formData.append('file', new Blob());
    service.importMasterData(formData).subscribe((res) => {
      expect(res).toEqual(importMock);
    });
  });
});
