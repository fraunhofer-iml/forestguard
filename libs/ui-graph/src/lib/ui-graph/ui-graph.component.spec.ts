/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiGraphComponent } from './ui-graph.component';

describe('UiGraphComponent', () => {
  let component: UiGraphComponent;
  let fixture: ComponentFixture<UiGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
