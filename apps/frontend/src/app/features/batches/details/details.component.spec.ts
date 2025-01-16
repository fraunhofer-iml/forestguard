/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Edge, ProofDto, ProofType } from '@forest-guard/api-interfaces';
import { saveAs } from 'file-saver';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { BatchDetailsComponent } from './details.component';
import { BatchStatusEnum } from './enum/batchStatusEnum';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

describe('BatchDetailsComponent', () => {
  let component: BatchDetailsComponent;
  let fixture: ComponentFixture<BatchDetailsComponent>;
  let batchService: jest.Mocked<BatchService>;

  beforeEach(async () => {
    const batchServiceMock: Partial<jest.Mocked<BatchService>> = {
      getExportBatchById: jest.fn(),
      createBatches: jest.fn(),
      createHarvestBatches: jest.fn(),
      getRelatedBatches: jest.fn().mockReturnValue(
        of({
          coffeeBatches: [], // oder mit einem Beispielobjekt
          edges: [],
        })
      ),
    };

    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [BatchDetailsComponent],
      providers: [
        {
          provide: BatchService,
          useValue: batchServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of('1'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchDetailsComponent);
    component = fixture.componentInstance;
    batchService = TestBed.inject(BatchService) as jest.Mocked<BatchService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getProof', () => {
    it('should return undefined if proofs is not provided', () => {
      const result = component.getProof(ProofType.PROOF_OF_FREEDOM);
      expect(result).toBeUndefined();
    });

    it('should return the proof with the specified type', () => {
      const proofs: ProofDto[] = [
        { type: ProofType.PROOF_OF_FREEDOM, documentId: '1', documentRef: '2', notice: '' },
        { type: ProofType.PROOF_OF_OWNERSHIP, documentId: '3', documentRef: '4', notice: '' },
      ];
      const result = component.getProof(ProofType.PROOF_OF_OWNERSHIP, proofs);
      expect(result).toEqual(proofs[1]);
    });

    it('should return undefined if no proof with the specified type is found', () => {
      const proofs: ProofDto[] = [
        { type: ProofType.PROOF_OF_FREEDOM, documentId: '1', documentRef: '2', notice: '' },
        { type: ProofType.PROOF_OF_FREEDOM, documentId: '3', documentRef: '4', notice: '' },
      ];
      const result = component.getProof(ProofType.PROOF_OF_OWNERSHIP, proofs);
      expect(result).toBeUndefined();
    });

    it('should return "active" status when active is true', () => {
      expect(component.isBatchActive(true)).toBe(BatchStatusEnum.active);
    });

    it('should return "inactive" status when active is false', () => {
      expect(component.isBatchActive(false)).toBe(BatchStatusEnum.inactive);
    });

    it('should download batch information and save it as a JSON file', () => {
      const mockBatch = { id: 'clz6ku98k0009koqcqv7w2a7b', name: 'Batch' };
      const id = 'clz6ku98k0009koqcqv7w2a7b';
      const expectedString = JSON.stringify(mockBatch, null, 2);
      const blob = new Blob([expectedString], { type: 'application/json' });

      batchService.getExportBatchById.mockReturnValue(of({} as Blob));
      component.exportBatchInformationAsJson(id);

      expect(saveAs).toHaveBeenCalledWith(blob, 'batch.json');
    });

    describe('findOrder', () => {
      it('should return an empty array when edges are undefined', () => {
        expect(component.findOrder(undefined, 'A')).toEqual([]);
      });

      it('should return the correct order for a simple chain', () => {
        const edges: Edge[] = [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
        ];
        const result = component.findOrder(edges, 'A');
        expect(result).toEqual(['C', 'B', 'A']);
      });

      it('should return the correct order when starting in the middle of the chain', () => {
        const edges: Edge[] = [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
        ];
        const result = component.findOrder(edges, 'B');
        expect(result).toEqual(['C', 'B', 'A']);
      });

      it('should return the correct order for multiple disconnected components', () => {
        const edges: Edge[] = [
          { from: 'A', to: 'B' },
          { from: 'C', to: 'D' },
          { from: 'E', to: 'F' },
        ];
        const result = component.findOrder(edges, 'E');
        expect(result).toEqual(['F', 'E']);
      });
    });
  });

  it('should handle related$ data correctly', (done) => {
    const mockData = {
      data: {
        coffeeBatches: [],
        edges: [],
      },
      id: '123',
    };

    batchService.getRelatedBatches.mockReturnValue(of(mockData));
    component.related$.subscribe((data) => {
      expect(data.coffeeBatches).toEqual(mockData.data.coffeeBatches);
      expect(data.edges).toEqual(mockData.data.edges);
      done();
    });
  });
});
