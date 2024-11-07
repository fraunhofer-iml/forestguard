import { ImportResponseDto } from '@forest-guard/api-interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ImportService {
  constructor(private httpClient: HttpClient) {}

  public importMasterData(formData: FormData): Observable<ImportResponseDto> {
    return this.httpClient.post<ImportResponseDto>(`${environment.IMPORT.URL}`, formData);
  }
}
