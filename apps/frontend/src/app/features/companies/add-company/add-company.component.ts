/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { toast } from 'ngx-sonner';
import { catchError, EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Messages } from '../../../shared/messages';
import { CompanyService } from '../../../shared/services/company/company.service';
import { CompanyForm } from './model/forms';
import { AddCompanyService } from './service/add-company.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
})
export class AddCompanyComponent {
  loading = false;
  companyFormGroup: FormGroup<CompanyForm> = new FormGroup<CompanyForm>({
    name: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    additionalInformation: new FormControl(''),
  });

  constructor(
    public authenticationService: AuthenticationService,
    private readonly companyService: CompanyService,
    private readonly createCompanyService: AddCompanyService,
    private readonly router: Router
  ) {}

  submitCompany() {
    if (!this.companyFormGroup.valid) {
      this.companyFormGroup.markAllAsTouched();
      toast.error(Messages.error);
    } else {
      this.loading = true;
      const newCompany = this.companyService.createCompany(this.createCompanyService.generateCompany(this.companyFormGroup));
      newCompany
        .pipe(
          catchError((error: HttpErrorResponse) => {
            toast.error(error.error.message);
            this.loading = false;
            return EMPTY;
          })
        )
        .subscribe(() => {
          location.reload();
          this.router.navigate(['/companies', this.authenticationService.getCurrentCompanyId() ?? '']);
          this.loading = false;
          this.companyFormGroup.reset();
          toast.success(Messages.successCompany);
        });
    }
  }
}
