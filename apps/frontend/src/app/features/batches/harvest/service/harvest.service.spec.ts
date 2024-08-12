import { BatchCombinedCreateDto, ProcessStepWithMultipleHarvestedLandsCreateDto } from '@forest-guard/api-interfaces';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HarvestService } from './harvest.service';

describe('HarvestService', (): void => {
  let service: HarvestService;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [HarvestService, HttpClient, HttpHandler],
      imports: [],
    }).compileComponents();

    service = TestBed.inject(HarvestService);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should create a ProcessStepCreateDto', () => {
    const plotsOfLand: string[] = ['ctest401'];
    const formGroup: FormGroup = formBuilder.group({
      date: new Date('2023-01-01'),
      processOwner: 'McFarland, Guillermo',
      authorOfEntry: 'Smith, Jane',
      weight: 100,
    });

    const result = service.createNewProcessStep(formGroup, plotsOfLand);

    const expected: ProcessStepWithMultipleHarvestedLandsCreateDto = {
      location: '',
      date: '2023-01-01T00:00:00.000Z',
      recordedBy: 'McFarland, Guillermo',
      executedBy: 'Smith, Jane',
      harvestedLands: plotsOfLand,
    };

    expect(result).toEqual(expected);
  });

  it('should create a BatchCreateDto', () => {
    const plotsOfLand: string[] = ['ctest401'];
    const formGroup: FormGroup = formBuilder.group({
      date: new Date('2023-01-01'),
      processOwner: 'McFarland, Guillermo',
      authorOfEntry: 'Smith, Jane',
      weight: 100,
    });

    const result = service.createNewHarvestBatch(formGroup, plotsOfLand);

    const expected: BatchCombinedCreateDto = {
      weight: 100,
      recipient: '',
      processStep: {
        location: '',
        date: '2023-01-01T00:00:00.000Z',
        recordedBy: 'McFarland, Guillermo',
        executedBy: 'Smith, Jane',
        harvestedLands: plotsOfLand,
      },
    };
    expect(result).toEqual(expected);
  });
});
