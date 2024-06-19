import { Edge, ProofDto, ProofType } from '@forrest-guard/api-interfaces';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { BatchDetailsComponent } from './details.component';

describe('BatchDetailsComponent', () => {
  let component: BatchDetailsComponent;
  let fixture: ComponentFixture<BatchDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [BatchDetailsComponent],
      providers: [
        {
          provide: BatchService,
          useValue: {
            getBatchById: jest.fn(),
          },
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
});
