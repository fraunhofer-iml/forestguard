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

  it('should call readCultivationsByType and return an array of CultivationDto', () => {
    const dummyCultivations: CultivationDto[] = [
      { id: '1', type: 'coffe', sort: 'arabica' },
      { id: '2', type: 'coffe', sort: 'robusta' },
    ];
    const type = 'coffee';

    service.readCultivationsByType(type).subscribe((cultivations) => {
      expect(cultivations.length).toBe(2);
      expect(cultivations).toEqual(dummyCultivations);
    });

    const req = httpMock.expectOne(`${environment.CULTIVATIONS.URL}?type=${type}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCultivations);
  });

  it('should handle error when readCultivationsByType fails', () => {
    const type = 'coffee';
    const errorMessage = 'Error loading cultivations';

    service.readCultivationsByType(type).subscribe(
      () => fail('should have failed with the network error'),
      (error: string) => {
        expect(error).toContain(errorMessage);
      }
    );

    const req = httpMock.expectOne(`${environment.CULTIVATIONS.URL}?type=${type}`);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
