/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CultivationDto } from '@forest-guard/api-interfaces';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { CultivationService } from './cultivation.service';

describe('CultivationService', () => {
  let service: CultivationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CultivationService],
    });
    service = TestBed.inject(CultivationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call readCultivationsBycCommodity and return an array of CultivationDto', () => {
    const dummyCultivations: CultivationDto[] = [
      { id: '1', commodity: 'coffee', sort: 'arabica', quality: 'ecol' },
      { id: '2', commodity: 'coffee', sort: 'robusta', quality: 'ecol' },
    ];
    const commodity = 'coffee';

    service.readCultivationsByCommodity(commodity).subscribe((cultivations) => {
      expect(cultivations.length).toBe(2);
      expect(cultivations).toEqual(dummyCultivations);
    });

    const req = httpMock.expectOne(`${environment.CULTIVATIONS.URL}?commodity=${commodity}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCultivations);
  });

  it('should handle error when readCultivationsByCommodity fails', () => {
    const commodity = 'coffee';
    const errorMessage = 'Error loading cultivations';

    service.readCultivationsByCommodity(commodity).subscribe(
      () => fail('should have failed with the network error'),
      (error: string) => {
        expect(error).toContain(errorMessage);
      }
    );

    const req = httpMock.expectOne(`${environment.CULTIVATIONS.URL}?commodity=${commodity}`);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should call getSorts and return an array of sorts', () => {
    const sortsMock = ['Sort 1', 'Sort 2'];

    service.getSorts().subscribe((sorts) => {
      expect(sorts).toEqual(sortsMock);
    });

    const req = httpMock.expectOne(`${environment.CULTIVATIONS.URLSORTS}`);
    expect(req.request.method).toBe('GET');
    req.flush(sortsMock);
  });

  it('should call getQualities without sort parameter and return an array of qualities', () => {
    const qualitiesMock = ['Quality 1', 'Quality 2'];

    service.getQualities().subscribe((qualities) => {
      expect(qualities).toEqual(qualitiesMock);
    });

    const req = httpMock.expectOne(`${environment.CULTIVATIONS.URLQUALITIES}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('sort')).toBeFalsy();
    req.flush(qualitiesMock);
  });
});
