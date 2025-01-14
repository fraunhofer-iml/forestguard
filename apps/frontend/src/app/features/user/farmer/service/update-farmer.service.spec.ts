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
