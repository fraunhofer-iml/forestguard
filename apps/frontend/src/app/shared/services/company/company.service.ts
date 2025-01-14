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

import { BatchDto, CompanyCreateDto, CompanyDto, UserDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Uris } from '../../uris';

@Injectable()
export class CompanyService {
  constructor(private readonly httpClient: HttpClient) {}

  public createCompany(company: CompanyCreateDto): Observable<CompanyDto> {
    return this.httpClient.post<CompanyDto>(environment.COMPANIES.URL, company);
  }

  public getCompanyById(id: string): Observable<CompanyDto> {
    return this.httpClient.get<CompanyDto>(`${environment.COMPANIES.URL}/${id}`).pipe(shareReplay(1));
  }

  public getFarmersByCompanyId(id: string): Observable<UserOrFarmerDto[]> {
    return this.httpClient.get<UserOrFarmerDto[]>(`${environment.COMPANIES.URL}/${id}${Uris.farmers}`);
  }

  public getEmployeesOfCompany(companyId: string): Observable<UserDto[]> {
    return this.getCompanyById(companyId).pipe(map((company) => company.employees ?? []));
  }

  public getBatchesOfCompany(companyId: string, query?: string): Observable<BatchDto[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }
    return this.httpClient.get<BatchDto[]>(`${environment.COMPANIES.URL}/${companyId}${Uris.batches}`, { params });
  }

  public getCompanies(): Observable<CompanyDto[]> {
    return this.httpClient.get<CompanyDto[]>(`${environment.COMPANIES.URL}`).pipe(shareReplay(1));
  }
}
