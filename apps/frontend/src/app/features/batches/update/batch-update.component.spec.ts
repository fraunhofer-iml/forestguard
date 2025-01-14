/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchDto } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { ProcessStepService } from '../../../shared/services/process-step/process.step.service';
import { UserService } from '../../../shared/services/user/user.service';
import { BatchUpdateComponent } from './batch-update.component';

describe('BatchUpdateComponent', () => {
  let component: BatchUpdateComponent;
  let fixture: ComponentFixture<BatchUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatAutocompleteModule],
      declarations: [BatchUpdateComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '0de044f0-bc57-495f-94c1-12ddb4fd05a1',
              },
              queryParams: {
                batchIds: '0de044f0-bc57-495f-94c1-493085934ß5' + '0de044f0-bc57-495f-94c1-12ddb4fd05a1',
              },
            },
          },
        },
        {
          provide: AuthenticationService,
          useValue: {
            getCurrentCompanyId: jest.fn().mockReturnValue(''),
          },
        },
        UserService,
        CompanyService,
        BatchService,
        ProcessStepService,
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should add a batch to the form array', () => {
    const initialLength = component.outBatches.length;
    component.addBatchItem();
    expect(component.outBatches.length).toBe(initialLength + 1);
  });

  it('should remove a batch from the form array', () => {
    component.outputBatchForm = new FormBuilder().group({
      outBatches: new FormArray([new FormBuilder().group({ weight: [10], recipient: ['test recipient'] })]),
    });

    component.removeBatchItem(0);
    expect(component.outBatches.length).toBe(0);
  });

  it('should initialize formGroup and outputBatchForm correctly', () => {
    expect(component.formGroup).toBeInstanceOf(FormGroup);
    expect(component.outputBatchForm).toBeInstanceOf(FormGroup);

    const formControls = component.formGroup.controls;
    expect(formControls['location']).toBeInstanceOf(FormControl);
    expect(formControls['dateOfProcess']).toBeInstanceOf(FormControl);
    expect(formControls['processName']).toBeInstanceOf(FormControl);
    expect(formControls['recordedBy']).toBeInstanceOf(FormControl);
    expect(formControls['executedBy']).toBeInstanceOf(FormControl);
    expect(formControls['plotOfLand']).toBeInstanceOf(FormControl);

    const outputBatchFormArray = component.outputBatchForm.get('outBatches') as FormArray;
    expect(outputBatchFormArray).toBeInstanceOf(FormArray);
    expect(outputBatchFormArray.length).toEqual(1);
  });

  it('should submit form', () => {
    component.formGroup.patchValue({
      location: 'Location',
      dateOfProcess: new Date(),
      processName: 'Harvesting',
      recordedBy: 'Recorder',
      executedBy: 'Executor',
      plotOfLand: 'Coffeefield',
    });

    component.addBatchItem();
    component.submit();

    expect(component.formGroup.valid).toBeTruthy();
    expect(component.outputBatchForm.valid).toBeFalsy();
  });

  it('should handle batches with missing weight control', () => {
    component.outBatches.push(
      new FormGroup({
        weight: new FormControl(10),
      })
    );
    component.outBatches.push(new FormGroup({}));
    component.outBatches.push(
      new FormGroup({
        weight: new FormControl(30),
      })
    );
    expect(component.getOutputWeight()).toBe(40);
  });

  it('should calculate weight of batches correctly', () => {
    const result = component.calculateTotalWeightOfBatches([{ weight: 10 }, { weight: 20 }] as BatchDto[]);
    expect(result).toEqual(30);
  });

  it('should show error if formGroup is invalid', () => {
    const toastErrorMock = jest.spyOn(toast, 'error');
    jest.spyOn(component.formGroup, 'invalid', 'get').mockReturnValue(true);
    jest.spyOn(component.outputBatchForm, 'invalid', 'get').mockReturnValue(false);
    jest.spyOn(component, 'getOutputWeight').mockReturnValue(1);
    jest.spyOn(component, 'calculateTotalWeightOfBatches').mockReturnValue(2);

    component.submit();
    expect(toastErrorMock).toHaveBeenCalledWith('Please fill in all required fields');
  });
});
