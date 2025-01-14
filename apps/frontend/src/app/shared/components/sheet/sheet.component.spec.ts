/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SheetComponent } from './sheet.component';

describe('SheetComponent', () => {
  let component: SheetComponent;
  let fixture: ComponentFixture<SheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open', () => {
    component.open();

    expect(component.visible).toEqual(true);
  });

  it('should close', (done) => {
    component.open();
    component.close();

    expect(component.visible).toEqual(true);

    component.closing$.subscribe((closing) => {
      expect(closing).toEqual(true);
    });

    setTimeout(() => {
      expect(component.visible).toEqual(false);
      done();
    }, 300);
  });

  it('should clear previous timeout when close is called multiple times', (done) => {
    component.open();
    component.close();
    component.close();

    expect(component.visible).toEqual(true);

    setTimeout(() => {
      expect(component.visible).toEqual(false);
      done();
    }, 300);
  });
});
