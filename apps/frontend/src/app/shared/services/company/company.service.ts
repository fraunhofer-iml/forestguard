import { BatchDto, CompanyCreateDto, CompanyDto, FarmerDto } from '@forest-guard/api-interfaces';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Uris } from '../../uris';

@Injectable()
export class CompanyService {
  constructor(private httpClient: HttpClient) {}

  public createCompany(company: CompanyCreateDto): Observable<CompanyDto> {
    return this.httpClient.post<CompanyDto>(environment.COMPANIES.URL, company);
  }

  public getCompanyById(id: string): Observable<CompanyDto> {
    return this.httpClient.get<CompanyDto>(`${environment.COMPANIES.URL}/${id}`);
  }

  public getFarmersByCompanyId(id: string): Observable<FarmerDto[]> {
    return this.httpClient.get<FarmerDto[]>(`${environment.COMPANIES.URL}/${id}${Uris.farmers}`);
  }

  public getBatchesOfCompany(companyId: string, query?: string): Observable<BatchDto[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }
    return this.httpClient.get<BatchDto[]>(`${environment.COMPANIES.URL}/${companyId}${Uris.batches}`, { params });
  }
}
