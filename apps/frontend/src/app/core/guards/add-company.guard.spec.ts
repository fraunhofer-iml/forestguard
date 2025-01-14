/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AddressDto, CompanyDto } from '@forest-guard/api-interfaces';
import { KeycloakService } from 'keycloak-angular';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CompanyService } from '../../shared/services/company/company.service';
import { AuthenticationService } from '../services/authentication.service';
import { addCompanyGuard } from './add-company.guard';

describe('addCompanyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => addCompanyGuard(...guardParameters));
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), AuthenticationService, KeycloakService, CompanyService],
    });
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to the company page if the company exists', async () => {
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {
      url: '/companies',
    } as any;

    jest.spyOn(AuthenticationService.prototype, 'getCurrentCompanyId').mockReturnValue('1');
    jest
      .spyOn(CompanyService.prototype, 'getCompanyById')
      .mockReturnValue(of(new CompanyDto('1', '', new AddressDto('', '', '', '', '', '', ''), undefined)));

    const resultObservable = await TestBed.runInInjectionContext(() => addCompanyGuard(route, state));
    const result = await firstValueFrom(resultObservable as Observable<GuardResult>);

    expect(result as UrlTree).toEqual(router.parseUrl('/companies/1'));
  });

  it('should permit access to the add-company page', async () => {
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {
      url: '/companies',
    } as any;

    jest.spyOn(AuthenticationService.prototype, 'getCurrentCompanyId').mockReturnValue('1');
    jest
      .spyOn(CompanyService.prototype as any, 'getCompanyById')
      .mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not found' })));

    const resultObservable = await TestBed.runInInjectionContext(() => addCompanyGuard(route, state));
    const result = await firstValueFrom(resultObservable as Observable<GuardResult>);

    expect(result).toEqual(true);
  });

  it('should allow access to the add-company page if the company is missing in the database', async () => {
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {
      url: '/companies',
    } as any;

    jest.spyOn(AuthenticationService.prototype, 'getCurrentCompanyId').mockReturnValue('1');
    jest
      .spyOn(CompanyService.prototype as any, 'getCompanyById')
      .mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not found' })));

    const resultObservable = await TestBed.runInInjectionContext(() => addCompanyGuard(route, state));
    const result = await firstValueFrom(resultObservable as Observable<GuardResult>);

    expect(result).toEqual(true);
  });

  it('should deny access to the add-company page if the company does not exist in keycloak and database', async () => {
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {
      url: '/companies',
    } as any;

    jest.spyOn(AuthenticationService.prototype, 'getCurrentCompanyId').mockReturnValue(null);
    jest
      .spyOn(CompanyService.prototype as any, 'getCompanyById')
      .mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not found' })));

    const result = await TestBed.runInInjectionContext(() => addCompanyGuard(route, state));

    expect(result).toEqual(false);
  });
});
