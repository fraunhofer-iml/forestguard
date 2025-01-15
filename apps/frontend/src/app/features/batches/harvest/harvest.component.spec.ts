/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
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
      imports: [MatAutocompleteModule],
      declarations: [HarvestComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        UserService,
        { provide: BatchService, useValue: batchServiceMock },
        {
          provide: AuthenticationService,
          useValue: {
            getCurrentCompanyId: jest.fn().mockReturnValue(''),
          },
        },
        CompanyService,
        PlotOfLandService,
        HarvestService,
        HttpClient,
        HttpHandler,
        FormBuilder,
        provideHttpClientTesting(),
      ],
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

  it('should add a plot of land if processOwner is not null', () => {
    component.harvestFormGroup.get('processOwner')?.setValue('owner');

    component.addPlotOfLand();
    expect(component.plotsOfLand.length).toBe(2);
  });

  it('should remove a plot of land at the specified index', () => {
    component.plotsOfLand.push(component.createPlotOfLand());
    expect(component.plotsOfLand.length).toBe(2);

    component.removePlotOfLand(1);
    expect(component.plotsOfLand.length).toBe(1);
  });
});
