import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Uris } from '../../uris';

@Injectable()
export class ProcessStepService {
  constructor(private httpClient: HttpClient) {}

  public addDocToProcessStep(userId: string, file: File, description: string): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    return this.httpClient.post<Document>(`${environment.PROCESSSTEPS.URL}/${userId}${Uris.document}`, formData);
  }
}
