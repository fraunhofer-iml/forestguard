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

import { company1Mock, farmer1Mock } from '@forest-guard/api-interfaces';
import { KeycloakService } from 'keycloak-angular';
import { of, switchMap } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../shared/services/company/company.service';
import { UserService } from '../../../shared/services/user/user.service';
import { FarmerComponent } from './farmer.component';
import { UpdateFarmerService } from './service/update-farmer.service';

describe('FarmerComponent', () => {
  let component: FarmerComponent;
  let fixture: ComponentFixture<FarmerComponent>;
  let companyService: jest.Mocked<CompanyService>;
  let keycloakService: jest.Mocked<KeycloakService>;

  beforeEach(async () => {
    companyService = {
      getCompanyById: jest.fn(),
    } as never;

    keycloakService = {
      getToken: jest.fn().mockReturnValue(Promise.resolve('token')),
      keycloakEvents$: of(),
      getKeycloakInstance: jest.fn().mockReturnValue({
        tokenParsed: {
          preferred_username: 'user',
        },
      }),
    } as never;

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [FarmerComponent],
      providers: [
        UserService,
        CompanyService,
        UpdateFarmerService,
        HttpClient,
        HttpHandler,
        { provide: KeycloakService, useValue: keycloakService },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FarmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should create an observable company$ based on the farmer$', () => {
    component.farmer$ = of(farmer1Mock);
    companyService.getCompanyById.mockReturnValue(of(company1Mock));
    component.company$ = component.farmer$?.pipe(switchMap((farmer) => companyService.getCompanyById(farmer.employeeId)));
    component.company$?.subscribe((result) => {
      expect(result).toEqual(company1Mock);
    });

    expect(companyService.getCompanyById).toHaveBeenCalledWith(farmer1Mock.employeeId);
  });
});
