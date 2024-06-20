import { PlotOfLandCreateDto, PlotOfLandDto, PlotOfLandUpdateDto, ProofDto } from '@forrest-guard/api-interfaces';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PlotOfLandService } from './plotOfLand.service';

describe('PlotOfLandService', (): void => {
  let service: PlotOfLandService;
  let plotOfLandMock: PlotOfLandDto;
  let plotOfLandCreateMock: PlotOfLandCreateDto;
  let proofsMock: ProofDto[];
  let proofMock: ProofDto;
  let plotOfLandUpdateMock: PlotOfLandUpdateDto;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [PlotOfLandService, HttpClient, HttpHandler],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(PlotOfLandService);
    plotOfLandCreateMock = {
      country: 'Peru',
      region: 'Ucayali',
      district: 'Coronel Portillo',
      nationalPlotOfLandId: 'n1',
      localPlotOfLandId: 'l1',
      description: 'Lorem ipsum dolor sit amet.',
      polygonData: '[{ lat: -32.364, lng: 153.207 }]',
      areaInHA: 1,
      cultivatedWith: 'arabica',
    };

    proofsMock = [
      {
        documentId: 'aa7dc794-5d99-4758-be05-a813a28d0124',
        type: 'ownership',
        documentRef: '/ownership/1',
        notice: 'notice',
      },
    ];

    plotOfLandMock = {
      id: '53252ae9-fb8e-4a19-8f03-ed6ed5977501',
      country: 'Peru',
      region: 'Ucayali',
      district: 'Coronel Portillo',
      nationalPlotOfLandId: 'n1',
      localPlotOfLandId: 'l1',
      description: 'Lorem ipsum dolor sit amet.',
      polygonData: '[{ lat: -32.364, lng: 153.207 }]',
      areaInHA: 1,
      cultivatedWith: {
        id: '4f7afc7e-2795-4548-bf45-8217a23ef6b2',
        type: 'coffee',
        sort: 'arabica',
      },
      proofs: [
        {
          documentId: 'aa7dc794-5d99-4758-be05-a813a28d0124',
          type: 'ownership',
          documentRef: '/ownership/1',
          notice: 'notice',
        },
      ],
    };
    proofsMock = [
      {
        documentId: 'aa7dc794-5d99-4758-be05-a813a28d0124',
        type: 'ownership',
        documentRef: '/ownership/1',
        notice: 'notice',
      },
    ];

    proofMock = {
      documentId: 'aa7dc794-5d99-4758-be05-a813a28d0124',
      type: 'ownership',
      documentRef: '/ownership/1',
      notice: 'notice',
    };

    plotOfLandUpdateMock = {
      cultivatedWith: 'string',
    };
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should create a plotOfLand', () => {
    const farmerId = '53252ae9-fb8e-4a19-8f03-ed6ed5977501';
    service.createPlotOfLand(farmerId, plotOfLandCreateMock).subscribe((res) => {
      expect(res).toEqual(plotOfLandMock);
    });
  });

  it('should get plotOfLand by id', () => {
    const plotOfLandId = '53252ae9-fb8e-4a19-8f03-ed6ed5977501';
    service.getPlotOfLandById(plotOfLandId).subscribe((res) => {
      expect(res).toEqual(plotOfLandMock);
    });
  });

  it('should get proofs', () => {
    const polId = 'aa7dc794-5d99-4758-be05-a813a28d0124';
    service.getProofsOfPlotOfLand(polId).subscribe((res) => {
      expect(res).toEqual(proofsMock);
    });
  });

  it('should update a plotOfLand', () => {
    const id = '53252ae9-fb8e-4a19-8f03-ed6ed5977501';
    service.updatePlotOfLand(id, plotOfLandCreateMock).subscribe((res) => {
      expect(res).toEqual(plotOfLandUpdateMock);
    });
  });

  it('should create a proof', () => {
    const id = '53252ae9-fb8e-4a19-8f03-ed6ed5977501';
    const formData = new FormData();
    formData.append('file', new Blob());
    formData.append('type', proofMock.type);
    service.createProof(id, formData).subscribe((res) => {
      expect(res).toEqual(proofMock);
    });
  });
});
