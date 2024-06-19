import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BatchUpdateComponent } from './batch-update.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user/user.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CompanyService } from '../../../shared/services/company/company.service';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';


describe('BatchUpdateComponent', () => {
  let component: BatchUpdateComponent;
  let fixture: ComponentFixture<BatchUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchUpdateComponent],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '0de044f0-bc57-495f-94c1-12ddb4fd05a1',
              },
              queryParams: {
                batchIds:
                  '0de044f0-bc57-495f-94c1-493085934ß5' +
                  '0de044f0-bc57-495f-94c1-12ddb4fd05a1'
              }
            },
          }
        },
        UserService,
        CompanyService,
        BatchService,
        HttpClient,
        HttpHandler
      ]

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
    expect(formControls['date']).toBeInstanceOf(FormControl);
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
      date: new Date(),
      processName: 'Harvesting',
      recordedBy: 'Recorder',
      executedBy: 'Executor',
      plotOfLand: 'Coffeefield'
    });

    component.addBatchItem();
    component.submit();

    expect(component.formGroup.valid).toBeTruthy();
    expect(component.outputBatchForm.valid).toBeFalsy();
  });
});
