/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AddressCreateDto, farmer1Mock, UserUpdateDto } from '@forest-guard/api-interfaces';
import { TestBed } from '@angular/core/testing';
import { UpdateFarmerService } from './update-farmer.service';

describe('UpdateFarmerService', (): void => {
  let service: UpdateFarmerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [UpdateFarmerService],
    }).compileComponents();

    service = TestBed.inject(UpdateFarmerService);
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should convert farmer data to UserUpdateDto', () => {
    const result = service.convertFarmerToUserUpdateDto(farmer1Mock);
    expect(result).toBeInstanceOf(UserUpdateDto);
    expect(result.firstName).toBe('Guillermo');
    expect(result.lastName).toBe('McFarland');
    expect(result.email).toBe('user@example.com');
    expect(result.mobilePhoneNumber).toBe('+5114841701');
  });

  it('should return the updated address if provided', () => {
    const address: AddressCreateDto = {
      street: 'Example Street',
      postalCode: '12345',
      city: 'Example City',
      state: 'Example State',
      country: 'Example Country',
      additionalInformation: 'Good to know',
    };
    const result = service.updateAddress(address);
    expect(result).toEqual(address);
  });
});
