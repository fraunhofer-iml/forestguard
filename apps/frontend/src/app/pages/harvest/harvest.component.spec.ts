import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarvestComponent } from './harvest.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BatchService } from '../../shared/services/batch/batch.service';
import { of } from 'rxjs';
import { CompanyService } from '../../shared/services/company/company.service';
import { PlotOfLandService } from '../../shared/services/plotOfLand/plotOfLand.service';
import { PlotOfLandMockService } from '../../shared/services/plotOfLand/plotOfLandMock.service';
import { HarvestService } from './service/harvest.service';

describe('HarvestComponent', () => {
  let component: HarvestComponent;
  let fixture: ComponentFixture<HarvestComponent>;
  let batchServiceMock: any;

  beforeEach(async () => {
    batchServiceMock = {
      createHarvestBatches: jest.fn().mockReturnValue(of(null)),
    };

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [HarvestComponent],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      providers: [
        UserService,
        { provide: BatchService, useValue: batchServiceMock },
        CompanyService,
        PlotOfLandService,
        PlotOfLandMockService,
        HarvestService,
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HarvestComponent);
    component = fixture.componentInstance;
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
});
