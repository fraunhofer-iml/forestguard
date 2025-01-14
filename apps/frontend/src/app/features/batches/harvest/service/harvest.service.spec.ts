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

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should create a ProcessStepCreateDto', () => {
    const plotsOfLand: string[] = ['ctest401'];
    const formGroup: FormGroup = formBuilder.group({
      dateOfProcess: new Date('2023-01-01'),
      processOwner: { id: 'McFarland, Guillermo' },
      authorOfEntry: { id: 'Smith, Jane' },
      weight: 100,
    });

    const result = service.createNewProcessStep(formGroup, plotsOfLand);

    const expected: ProcessStepWithMultipleHarvestedLandsCreateDto = {
      location: '',
      dateOfProcess: '2023-01-01T00:00:00.000Z',
      executedBy: 'McFarland, Guillermo',
      recordedBy: 'Smith, Jane',
      harvestedLands: plotsOfLand,
    };

    expect(result).toEqual(expected);
  });

  it('should create a BatchCreateDto', () => {
    const plotsOfLand: string[] = ['ctest401'];
    const formGroup: FormGroup = formBuilder.group({
      dateOfProcess: new Date('2023-01-01'),
      processOwner: { id: 'McFarland, Guillermo' },
      authorOfEntry: { id: 'Smith, Jane' },
      recipient: { id: 'Recipient' },
      weight: 100,
    });

    const result = service.createNewHarvestBatch(formGroup, plotsOfLand);

    const expected: BatchCombinedCreateDto = {
      weight: 100,
      recipient: 'Recipient',
      processStep: {
        location: '',
        dateOfProcess: '2023-01-01T00:00:00.000Z',
        recordedBy: 'Smith, Jane',
        executedBy: 'McFarland, Guillermo',
        harvestedLands: plotsOfLand,
      },
    };
    expect(result).toEqual(expected);
  });
});
