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
});
