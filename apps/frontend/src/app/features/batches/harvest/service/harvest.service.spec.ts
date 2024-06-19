import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from "@angular/common/http";

import { HarvestService } from './harvest.service';
import { BatchCreateDto, ProcessStepCreateDto } from '@forrest-guard/api-interfaces';
import { FormBuilder, FormGroup } from '@angular/forms';

describe('HarvestService', (): void => {
  let service: HarvestService;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HarvestService,
        HttpClient,
        HttpHandler
      ],
      imports: [],
    }).compileComponents();

    service = TestBed.inject(HarvestService);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should create a ProcessStepCreateDto', () => {
    const formGroup: FormGroup = formBuilder.group({
      date: new Date('2023-01-01'),
      processOwner: 'McFarland, Guillermo',
      authorOfEntry: 'Smith, Jane',
      weight: 100,
    });

    const plotOfLandId = '348905';
    const result = service.createNewProcessStep(formGroup, plotOfLandId);

    const expected: ProcessStepCreateDto = {
      location: '',
      date: '2023-01-01T00:00:00.000Z',
      process: '',
      recordedBy: 'McFarland, Guillermo',
      executedBy: 'Smith, Jane',
      harvestedLand: '348905',
    };

    expect(result).toEqual(expected);
  });

  it('should create a BatchCreateDto', () => {
    const formGroup: FormGroup = formBuilder.group({
      date: new Date('2023-01-01'),
      processOwner: 'McFarland, Guillermo',
      authorOfEntry: 'Smith, Jane',
      weight: 100,
    });

    const plotOfLandId = '348905';
    const result = service.createNewHarvestBatch(formGroup, plotOfLandId);

    const expected: BatchCreateDto = {
      in: [],
      weight: 100,
      recipient: 'Smith, Jane',
      processStep: {
        location: '',
        date: '2023-01-01T00:00:00.000Z',
        process: '',
        recordedBy: 'McFarland, Guillermo',
        executedBy: 'Smith, Jane',
        harvestedLand: '348905',
      },
    };
    expect(result).toEqual(expected);
  });
});



