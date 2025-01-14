/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { catchError, map, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';
import { CompanyService } from '../../shared/services/company/company.service';
import { AuthenticationService } from '../services/authentication.service';

export const addCompanyGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authenticationService: AuthenticationService = inject(AuthenticationService);
  const router: Router = inject(Router);
  const companyService: CompanyService = inject(CompanyService);
  const keycloakCompanyId: string | undefined | null = authenticationService.getCurrentCompanyId();

  return keycloakCompanyId
    ? companyService.getCompanyById(keycloakCompanyId).pipe(
        map(() => router.parseUrl(`/companies/${keycloakCompanyId}`)),
        catchError((error) => {
          return error instanceof HttpErrorResponse && error.status === 404 ? of(true) : of(false);
        })
      )
    : false;
};
