/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Role } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { UserService } from '../../../shared/services/user/user.service';
import { AddUserComponent } from './add-user.component';
import { Roles } from './enum/roles';
import { GenerateUserService } from './service/generate-user.service';

jest.mock('ngx-sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let userServiceMock: jest.Mocked<UserService>;
  let companyServiceMock: jest.Mocked<CompanyService>;
  let generateUserServiceMock: jest.Mocked<GenerateUserService>;

  beforeEach(async () => {
    generateUserServiceMock = {
      generateNewUser: jest.fn(),
      generateNewFarmer: jest.fn(),
    } as any;

    userServiceMock = {
      createUser: jest.fn().mockReturnValue(of({})),
      createFarmer: jest.fn().mockReturnValue(of({})),
    } as any;

    companyServiceMock = {
      getCompanies: jest.fn().mockReturnValue(of([])),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [AddUserComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [MatAutocompleteModule, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: CompanyService, useValue: companyServiceMock },
        { provide: GenerateUserService, useValue: generateUserServiceMock },
        {
          provide: AuthenticationService,
          useValue: {
            getCurrentCompanyId: jest.fn().mockReturnValue(''),
            hasRole: jest.fn().mockReturnValue(Role.COOPERATIVE),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selectedRole to Roles.USER', () => {
    expect(component.selectedRole).toBe(Roles.USER);
  });

  it('should mark form as touched if form is invalid', () => {
    component.userFormGroup.controls.firstName.setValue(null);
    component.submitUserOrFarmer();
    expect(component.userFormGroup.touched).toBe(true);
  });

  it('should reset form fields when clearInputFields is called', () => {
    component.userFormGroup.setValue({
      employeeId: '123',
      personalId: '234',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      street: '123 Street',
      postalCode: '12345',
      city: 'City',
      country: 'Country',
      state: 'State',
      additionalInformation: 'additional Information',
    });

    component.clearInputFields();
    expect(component.userFormGroup.value).toEqual({
      employeeId: null,
      personalId: null,
      firstName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
      street: null,
      postalCode: null,
      city: null,
      country: null,
      state: null,
      additionalInformation: null,
    });
  });

  it('should set selectedRole correctly when setSelectedRole is called', () => {
    component.setSelectedRole(Roles.FARMER);
    expect(component.selectedRole).toBe(Roles.FARMER);
  });

  it('should call generateNewUser and createUser on submitUser when role is USER', () => {
    generateUserServiceMock.generateNewUser.mockReturnValue({} as any);
    component.userFormGroup.setValue({
      employeeId: '123',
      personalId: '234',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      street: '123 Street',
      postalCode: '12345',
      city: 'City',
      country: 'Country',
      state: 'State',
      additionalInformation: 'additional Information',
    });

    component.submitUser();
    expect(generateUserServiceMock.generateNewUser).toHaveBeenCalledWith(component.userFormGroup);
    expect(userServiceMock.createUser).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(expect.any(String));
  });

  it('should call generateNewFarmer and createFarmer on submitFarmer when role is FARMER', () => {
    generateUserServiceMock.generateNewFarmer.mockReturnValue({} as any);
    component.userFormGroup.setValue({
      employeeId: '123',
      personalId: '234',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      street: '123 Street',
      postalCode: '12345',
      city: 'City',
      country: 'Country',
      state: 'State',
      additionalInformation: 'additional Information',
    });

    component.selectedRole = Roles.FARMER;
    component.submitFarmer();
    expect(generateUserServiceMock.generateNewFarmer).toHaveBeenCalledWith(component.userFormGroup);
    expect(userServiceMock.createFarmer).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(expect.any(String));
  });

  it('should not submit if user form is invalid', () => {
    component.userFormGroup.controls.email.setValue(null);
    component.submitUserOrFarmer();
    expect(toast.error).toHaveBeenCalledWith(expect.any(String));
  });
});
