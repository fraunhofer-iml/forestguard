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
});
