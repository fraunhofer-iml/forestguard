/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CompanyService } from '../../../shared/services/company/company.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent {
  version = environment.VERSION;

  company$ = this.companyService.getCompanyById(this.authenticationService.getCurrentCompanyId() ?? '');

  constructor(
    public authenticationService: AuthenticationService,
    private readonly companyService: CompanyService
  ) {}

  getCompanyAbbrevation(companyName: string): string {
    return companyName
      .split(' ')
      .map((word) => word[0])
      .join('');
  }
}
