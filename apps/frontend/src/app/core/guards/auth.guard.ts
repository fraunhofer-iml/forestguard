/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
