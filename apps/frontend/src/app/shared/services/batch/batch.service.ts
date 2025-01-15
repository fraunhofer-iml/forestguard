/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
