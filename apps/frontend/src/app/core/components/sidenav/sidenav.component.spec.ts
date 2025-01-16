/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyDto } from '@forest-guard/api-interfaces';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { CompanyService } from '../../../shared/services/company/company.service';
import { AuthenticationService } from '../../services/authentication.service';
import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        {
          provide: CompanyService,
          useValue: {
            getCompanyById: jest.fn().mockReturnValue(of({ name: 'Test Company' } as CompanyDto)),
          },
        },
        {
          provide: AuthenticationService,
          useValue: {
            getCurrentCompanyId: jest.fn().mockReturnValue(''),
          },
        },
      ],
      declarations: [SidenavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
