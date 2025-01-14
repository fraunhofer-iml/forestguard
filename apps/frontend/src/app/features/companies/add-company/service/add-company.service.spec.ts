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

import { AddressCreateDto, CompanyCreateDto } from '@forest-guard/api-interfaces';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddCompanyService } from './add-company.service';

describe('CreateCompanyService', (): void => {
  let service: AddCompanyService;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AddCompanyService, HttpClient, HttpHandler],
      imports: [],
    }).compileComponents();

    service = TestBed.inject(AddCompanyService);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should create a AddressDto', () => {
    const formGroup: FormGroup = formBuilder.group({
      street: 'Example Street',
      postalCode: '12345',
      city: 'Example City',
      state: 'Example State',
      country: 'Example Country',
      additionalInformation: 'Example AdditionalInformation',
    });

    const result = service.generateAddress(formGroup);
    const expected: AddressCreateDto = {
      street: 'Example Street',
      postalCode: '12345',
      city: 'Example City',
      state: 'Example State',
      country: 'Example Country',
      additionalInformation: 'Example AdditionalInformation',
    };
    expect(result).toEqual(expected);
  });

  it('should create a CompanyCreateDto', () => {
    const formGroup: FormGroup = formBuilder.group({
      name: ['Example Street'],
      street: [''],
      postalCode: [''],
      city: [''],
      state: [''],
      country: [''],
    });
    const result = service.generateCompany(formGroup);
    const expected = new CompanyCreateDto('Example Street', new AddressCreateDto('', '', '', '', '', ''));
    expect(result).toEqual(expected);
  });
});
