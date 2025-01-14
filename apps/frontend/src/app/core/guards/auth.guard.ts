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

import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Messages } from '../../shared/messages';
import { CompanyService } from '../../shared/services/company/company.service';
import { Uris } from '../../shared/uris';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authenticationService: AuthenticationService = inject(AuthenticationService);
  const router: Router = inject(Router);
  const companyService: CompanyService = inject(CompanyService);

  if (!authenticationService.isAccountEnabled()) {
    return router.navigateByUrl('/unauthorized?account-disabled=true');
  }

  const keycloakCompanyId = authenticationService.getCurrentCompanyId();

  const isCompanyAddUrl = state.url.includes(Uris.addCompany);
  if (isCompanyAddUrl) {
    return true;
  }

  if (keycloakCompanyId) {
    return await validateCompanyExistence(keycloakCompanyId, companyService, router);
  }

  return false;
};

async function validateCompanyExistence(companyId: string, companyService: CompanyService, router: Router): Promise<boolean> {
  try {
    const company = await firstValueFrom(companyService.getCompanyById(companyId));
    return company?.id === companyId;
  } catch (error) {
    return handleCompanyError(error, router);
  }
}

function handleCompanyError(error: any, router: Router): boolean {
  if (error instanceof HttpErrorResponse && error.status === 404) {
    router.navigateByUrl(Uris.addCompany);
    toast.error(Messages.errorCompany);
  }
  return false;
}
