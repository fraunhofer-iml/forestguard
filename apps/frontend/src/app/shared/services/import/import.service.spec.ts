/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
