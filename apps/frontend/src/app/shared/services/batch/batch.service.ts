import { BatchCreateDto, BatchDto, ProcessDisplayDto, ProcessDto } from '@forrest-guard/api-interfaces';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable()
export class BatchService {
  constructor(private httpClient: HttpClient) {}

  public createBatches(batches: BatchCreateDto[]): Observable<ProcessDto> {
    return this.httpClient.post<ProcessDto>(environment.BATCHES.URL, batches);
  }

  public createHarvestBatches(harvests: BatchCreateDto[]): Observable<ProcessDto> {
    return this.httpClient.post<ProcessDto>(`${environment.BATCHES.URL}/harvests`, harvests);
  }

  public getBatchById(id: string): Observable<BatchDto> {
    return this.httpClient.get<BatchDto>(`${environment.BATCHES.URL}/${id}`);
  }

  public getRelatedBatches(id: string): Observable<{ data: ProcessDisplayDto; id: string }> {
    return this.httpClient.get<ProcessDisplayDto>(`${environment.BATCHES.URL}/${id}/related`).pipe(map((data) => ({ data, id })));
  }
}
