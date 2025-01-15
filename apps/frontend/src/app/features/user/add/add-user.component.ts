/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { FGFile, Role, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { catchError, EMPTY, merge } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Messages } from '../../../shared/messages';
import { UserService } from '../../../shared/services/user/user.service';
import { Roles } from './enum/roles';
import { UserForm } from './model/user-form';
import { GenerateUserService } from './service/generate-user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
})
export class AddUserComponent {
  selectedRole: string = Roles.USER;
  userFormGroup: FormGroup<UserForm> = new FormGroup<UserForm>({
    employeeId: new FormControl(null),
    personalId: new FormControl(null),
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null, Validators.required),
    street: new FormControl(null, Validators.required),
    postalCode: new FormControl(null, Validators.required),
    city: new FormControl(null, Validators.required),
    country: new FormControl(null, Validators.required),
    state: new FormControl(null, Validators.required),
    additionalInformation: new FormControl(''),
  });

  uploadedFiles: { file: File; documentType?: string }[] = [];

  protected readonly Roles = Roles;
  protected readonly Role = Role;

  constructor(
    public authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly generateUserService: GenerateUserService,
    private readonly router: Router
  ) {}

  setSelectedRole(role: string): void {
    this.selectedRole = role;
  }

  checkUserFieldsValidity(): boolean {
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber'];
    return requiredFields.every((field) => this.userFormGroup.get(field)?.valid);
  }

  submitUserOrFarmer(): void {
    if (this.selectedRole === Roles.USER && this.checkUserFieldsValidity()) {
      this.submitUser();
    } else if (this.selectedRole === Roles.FARMER && this.userFormGroup.valid) {
      this.submitFarmer();
    } else {
      toast.error(Messages.error);
      this.userFormGroup.markAllAsTouched();
    }
  }

  submitUser(): void {
    this.userService
      .createUser(this.generateUserService.generateNewUser(this.userFormGroup))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error.message.toLowerCase().includes('unique constraint')) {
            toast.error(Messages.errorUserExists);
            return EMPTY;
          }
          toast.error(error.error.message);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.clearInputFields();
        toast.success(Messages.successUser);
        this.router.navigate(['/companies', this.authenticationService.getCurrentCompanyId()]);
      });
  }

  submitFarmer(): void {
    this.userService
      .createFarmer(this.generateUserService.generateNewFarmer(this.userFormGroup))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error.message.toLowerCase().includes('unique constraint')) {
            toast.error(Messages.errorUserExists);
            return EMPTY;
          }
          toast.error(error.error.message);
          return EMPTY;
        })
      )
      .subscribe((createdFarmer: UserOrFarmerDto) => {
        if (this.uploadedFiles.length === 0) {
          this.clearInputFields();
          toast.success(Messages.successFarmer);
          this.router.navigate(['/users', createdFarmer.id]);
        }

        const fileUploads = this.uploadedFiles.map((uploadedFile) => {
          return this.userService.addDocumentToUser(createdFarmer.id, uploadedFile.file, uploadedFile.documentType ?? '');
        });

        merge(...fileUploads).subscribe(() => {
          this.clearInputFields();
          toast.success(Messages.successFarmer);
          this.router.navigate(['/users', createdFarmer.id]);
        });
      });
  }

  submitFile({ file, documentType }: FGFile): void {
    this.uploadedFiles.push({ file, documentType });
  }

  removeFile({ file, documentType }: FGFile): void {
    this.uploadedFiles = this.uploadedFiles.filter(
      (uploadedFile) => uploadedFile.file !== file && uploadedFile.documentType !== documentType
    );
  }

  clearInputFields(): void {
    this.userFormGroup.reset();
  }
}
