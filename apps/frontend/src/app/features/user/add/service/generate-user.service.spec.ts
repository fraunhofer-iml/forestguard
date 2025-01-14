/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AddressCreateDto, FarmerCreateDto, RoleType, UserCreateDto } from '@forest-guard/api-interfaces';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenerateUserService } from './generate-user.service';

describe('GenerateUserService', (): void => {
  let service: GenerateUserService;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [GenerateUserService, HttpClient, HttpHandler],
      imports: [],
    }).compileComponents();

    service = TestBed.inject(GenerateUserService);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should create a new User with provided values', () => {
    const formGroup: FormGroup = formBuilder.group({
      firstName: ['John'],
      lastName: ['Doe'],
      email: ['john@gmail.com'],
      employeeId: ['123'],
      number: [''],
      role: [RoleType.EMPLOYEE],
    });

    const result = service.generateNewUser(formGroup);
    expect(result).toEqual(new UserCreateDto('John', 'Doe', 'john@gmail.com', '123', '', RoleType.EMPLOYEE));
  });

  it('should create a new AddressCreateDto with provided values', () => {
    const formGroup: FormGroup = formBuilder.group({
      street: ['123 Street'],
      postalCode: ['12345'],
      city: ['City'],
      state: ['State'],
      country: ['Country'],
      additionalInformation: ['AdditionalInformation'],
    });

    const result = service.generateNewAddress(formGroup);
    expect(result).toEqual(new AddressCreateDto('123 Street', '12345', 'City', 'State', 'Country', 'AdditionalInformation'));
  });

  it('should create a new AddressCreateDto with provided values', () => {
    const formGroup: FormGroup = formBuilder.group({
      firstName: ['John'],
      lastName: ['Doe'],
      email: ['john.doe@example.com'],
      employeeId: ['123'],
      personalId: ['234'],
      street: ['123 Street'],
      postalCode: ['12345'],
      city: ['City'],
      state: ['State'],
      country: ['Country'],
      additionalInformation: ['AdditionalInformation'],
    });

    const result = service.generateNewFarmer(formGroup);
    expect(result).toEqual(
      new FarmerCreateDto(
        'John',
        'Doe',
        'john.doe@example.com',
        '123',
        '234',
        '',
        new AddressCreateDto('123 Street', '12345', 'City', 'State', 'Country', 'AdditionalInformation')
      )
    );
  });
});
