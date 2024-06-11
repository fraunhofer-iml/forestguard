import { ProofType } from '@forrest-guard/api-interfaces';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { PlotOfLandMockService } from '../../../shared/services/plotOfLand/plotOfLandMock.service';
import { UserService } from '../../../shared/services/user/user.service';
import { HarvestComponent } from './harvest.component';
import { HarvestService } from './service/harvest.service';

describe('HarvestComponent', () => {
  let component: HarvestComponent;
  let fixture: ComponentFixture<HarvestComponent>;
  let batchServiceMock;

  beforeEach(async () => {
    batchServiceMock = {
      createHarvestBatches: jest.fn().mockReturnValue(of(null)),
    };

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [HarvestComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        UserService,
        { provide: BatchService, useValue: batchServiceMock },
        CompanyService,
        PlotOfLandService,
        PlotOfLandMockService,
        HarvestService,
        HttpClient,
        HttpHandler,
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HarvestComponent);
    component = fixture.componentInstance;
    component.uploadSelectOption = [
      {
        value: ProofType.PROOF_OF_FREEDOM,
        key: 'Proof of freedom',
      },
      {
        value: ProofType.PROOF_OF_OWNERSHIP,
        key: 'Proof of ownership',
      },
    ];
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should clear input fields', () => {
    component.clearInputFields();

    expect(component.harvestFormGroup.pristine).toBe(true);
    expect(component.harvestFormGroup.untouched).toBe(true);
  });

  it('should mark all controls as touched', () => {
    component.submitHarvest();

    Object.keys(component.harvestFormGroup.controls).forEach((key) => {
      const control = component.harvestFormGroup.get(key);
      expect(control?.touched).toBeTruthy();
    });
  });

  describe('submitFile', () => {
    it('should set the file for the corresponding document type', () => {
      const file = new File(['file content'], 'file.txt');
      const documentType = ProofType.PROOF_OF_FREEDOM;

      component.submitFile({ file, documentType });

      const uploadSelectOption = component.uploadSelectOption.find((option) => option.value === documentType);
      expect(uploadSelectOption?.file).toBe(file);
    });

    it('should not set the file if the document type is not found', () => {
      const file = new File(['file content'], 'file.txt');
      const documentType = 'INVALID';

      component.submitFile({ file, documentType });

      const uploadSelectOption = component.uploadSelectOption.find((option) => option.value === documentType);
      expect(uploadSelectOption?.file).toBeUndefined();
    });
  });
});
