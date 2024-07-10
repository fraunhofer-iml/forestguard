import { PlotOfLandCreateDto } from '@forrest-guard/api-interfaces';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  it('should create a new PlotOfLandCreateDto with provided values', () => {
    const formGroup: FormGroup = formBuilder.group({
      region: ['region'],
      plotOfLand: ['plot'],
      polygondata: ['polygon'],
      nationalPlotOfLandId: ['123'],
      localPlotOfLandId: ['456'],
    });

    const result = service.createNewPlotOfLand(formGroup);
    expect(result).toEqual(new PlotOfLandCreateDto('', 'region', '', 'plot', 'polygon', 0, '', '123', '456'));
  });
});
