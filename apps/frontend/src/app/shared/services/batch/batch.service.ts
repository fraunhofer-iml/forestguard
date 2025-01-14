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

import { BatchCombinedCreateDto, BatchCreateDto, BatchDto, ProcessDisplayDto, ProcessDto } from '@forest-guard/api-interfaces';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Uris } from '../../uris';

@Injectable()
export class BatchService {
  constructor(private readonly httpClient: HttpClient) {}

  public createBatches(batches: BatchCreateDto[]): Observable<{ processStepId: string }> {
    return this.httpClient.post<{ processStepId: string }>(environment.BATCHES.URL, batches);
  }

  public createHarvestBatches(harvests: BatchCreateDto[]): Observable<ProcessDto> {
    return this.httpClient.post<ProcessDto>(`${environment.BATCHES.URL}${Uris.harvests}`, harvests);
  }

  public createHarvestBatchesCombined(harvests: BatchCombinedCreateDto): Observable<ProcessDto> {
    return this.httpClient.post<ProcessDto>(`${environment.BATCHES.URL}${Uris.harvestsCombined}`, harvests);
  }

  public getBatchById(id: string): Observable<BatchDto> {
    return this.httpClient.get<BatchDto>(`${environment.BATCHES.URL}/${id}`);
  }

  public getRelatedBatches(id: string): Observable<{ data: ProcessDisplayDto; id: string }> {
    return this.httpClient.get<ProcessDisplayDto>(`${environment.BATCHES.URL}/${id}${Uris.related}`).pipe(map((data) => ({ data, id })));
  }

  public getExportBatchById(id: string): Observable<Blob> {
    return this.httpClient.get<Blob>(`${environment.BATCHES.URL}/${id}${Uris.exportData}`);
  }
}
