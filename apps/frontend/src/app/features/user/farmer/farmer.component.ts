/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { FGFile, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Document } from '@prisma/client';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Messages } from '../../../shared/messages';
import { CompanyService } from '../../../shared/services/company/company.service';
import { UserService } from '../../../shared/services/user/user.service';
import { UpdateFarmerService } from './service/update-farmer.service';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
})
export class FarmerComponent {
  company$ = this.companyService.getCompanyById(this.authenticationService.getCurrentCompanyId() ?? '');
  reload$ = new BehaviorSubject(undefined);
  farmer$: Observable<UserOrFarmerDto> = combineLatest([this.route.params, this.reload$]).pipe(
    switchMap(([params]) => this.userService.getUserById(params['id']))
  );

  protected readonly window = window;
  MINIO_URL = environment.MINIO.URL;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly updateFarmerService: UpdateFarmerService,
    public authenticationService: AuthenticationService
  ) {}

  deleteDocument(document: Document) {
    this.userService.deleteDocumentById(document.userId ?? '', document.documentRef).subscribe(() => this.reload$.next(undefined));
  }

  submitFile({ fgFile, farmerId }: { fgFile: FGFile; farmerId: string }): void {
    this.userService.addDocumentToUser(farmerId, fgFile.file, fgFile.documentType ?? '').subscribe(() => this.reload$.next(undefined));
  }

  updateFarmerData(farmer: UserOrFarmerDto): void {
    this.userService
      .updateUser(farmer.id, this.updateFarmerService.convertFarmerToUserUpdateDto(farmer))
      .subscribe(() => toast.success(Messages.successUpdateFarmer));
  }
}
