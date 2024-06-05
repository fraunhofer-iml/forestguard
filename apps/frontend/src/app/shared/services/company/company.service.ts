import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import {
  CompanyCreateDto,
  CompanyDto,
  FarmerDto,
  ProcessDisplayDto,
} from '@forrest-guard/api-interfaces';

@Injectable()
export class CompanyService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public createCompany(company: CompanyCreateDto): Observable<CompanyDto> {
    return this.httpClient.post<CompanyDto>(environment.COMPANIES.URL, company);
  }

  public getCompanyById(id: string): Observable<CompanyDto> {
    return this.httpClient.get<CompanyDto>(`${environment.COMPANIES.URL}/${id}`);
  }

  public getFarmersByCompanyId(id: string): Observable<FarmerDto[]> {
    return this.httpClient.get<FarmerDto[]>(`${environment.COMPANIES.URL}/${id}/farmers`);
  }

  public getBatchesOfCompany(companyId: string, query?: string): Observable<ProcessDisplayDto[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }
    return this.httpClient.get<ProcessDisplayDto[]>(`${environment.COMPANIES.URL}/${companyId}/batches`,
      { params }
    );
  }
}
