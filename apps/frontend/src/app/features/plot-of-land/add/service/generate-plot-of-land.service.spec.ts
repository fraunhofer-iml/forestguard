import { CoordinateType, GeoDataDto, PlotOfLandCreateDto, Standard } from '@forest-guard/api-interfaces';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GeneratePlotOfLandService } from './generate-plot-of-land.service';

describe('GeneratePlotOfLandService', (): void => {
  let service: GeneratePlotOfLandService;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [GeneratePlotOfLandService, HttpClient, HttpHandler],
      imports: [],
    }).compileComponents();

    service = TestBed.inject(GeneratePlotOfLandService);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should create a new Geo Data with provided values', () => {
    const formGroup: FormGroup = formBuilder.group({
      geoDataStandard: new FormControl(Standard.UTM),
      geoDataType: new FormControl(CoordinateType.MultiPoint),
      geoDataCoordinate: new FormControl([-105.02986587151608, 40.622831213346714]),
      geoDataZone: new FormControl('456'),
    });

    const result = service.createGeoData(formGroup);
    expect(result).toEqual(new GeoDataDto(Standard.UTM, CoordinateType.MultiPoint, [-105.02986587151608, 40.622831213346714], '456'));
  });

  it('should create PlotOfLandCreateDto with provided values', () => {
    const formGroup = new FormGroup({
      region: new FormControl('Germany'),
      plotOfLand: new FormControl('Coffee Field'),
      geoDataStandard: new FormControl(Standard.UTM),
      geoDataType: new FormControl(CoordinateType.MultiPoint),
      geoDataCoordinate: new FormControl([-105.02986587151608, 40.622831213346714]),
      geoDataZone: new FormControl(null),
      cultivationSort: new FormControl('arabica'),
      nationalPlotOfLandId: new FormControl('456'),
      localPlotOfLandId: new FormControl('123'),
    });

    const result = service.createNewPlotOfLand(formGroup);

    expect(result).toEqual(
      new PlotOfLandCreateDto(
        '',
        'Germany',
        '',
        '',
        'Coffee Field',
        new GeoDataDto(Standard.UTM, CoordinateType.MultiPoint, [-105.02986587151608, 40.622831213346714], ''),
        0,
        'arabica',
        '',
        '456',
        '123'
      )
    );
  });
});
