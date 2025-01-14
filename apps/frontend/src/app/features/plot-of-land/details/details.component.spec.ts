/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProofDto, ProofType } from '@forest-guard/api-interfaces';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { PlotOfLandDetailsComponent } from './details.component';

describe('PlotOfLandDetailsComponent', () => {
  let component: PlotOfLandDetailsComponent;
  let fixture: ComponentFixture<PlotOfLandDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [PlotOfLandDetailsComponent],
      providers: [
        {
          provide: CompanyService,
          useValue: {
            getBatchesOfCompany: jest.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of('1'),
          },
        },
        BatchService,
        PlotOfLandService,
        HttpClient,
        HttpHandler,
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlotOfLandDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get proof by type from the provided proofs', () => {
    const proofs: ProofDto[] = [
      { type: ProofType.PROOF_OF_FREEDOM, documentId: '123', documentRef: '123', notice: '123' },
      { type: ProofType.PROOF_OF_OWNERSHIP, documentId: '123', documentRef: '123', notice: '123' },
    ];
    const result = component.getProof(ProofType.PROOF_OF_FREEDOM, proofs);
    expect(result).toEqual(proofs[0]);
  });

  it('should upload file when documentType is found and id is provided', () => {
    const file = new File([], 'proofOfFreedom.txt');
    const formDataSpy = jest.spyOn(FormData.prototype, 'append');
    const formDataInstance = new FormData();

    component.uploadSelectOption = [{ value: ProofType.PROOF_OF_FREEDOM, key: 'Proof of freedom from deforestation' }];
    component.uploadProof({ file, documentType: ProofType.PROOF_OF_FREEDOM }, '123');

    formDataInstance.append('file', file);
    formDataInstance.append('type', ProofType.PROOF_OF_FREEDOM);
    expect(formDataSpy).toHaveBeenCalledWith('file', file);
    expect(formDataSpy).toHaveBeenCalledWith('type', ProofType.PROOF_OF_FREEDOM);
  });

  it('should return filtered options when Proof of freedom is provided', () => {
    component.uploadSelectOption = [
      {
        value: ProofType.PROOF_OF_FREEDOM,
        key: 'Proof of freedom from deforestation',
      },
    ];

    const proofs: ProofDto[] = [];
    const filteredOptions = component.getFilteredOptions(proofs);
    expect(filteredOptions.length).toBe(1);
    expect(filteredOptions[0].value).toBe(ProofType.PROOF_OF_FREEDOM);
  });
});
