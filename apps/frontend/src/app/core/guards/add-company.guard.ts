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
