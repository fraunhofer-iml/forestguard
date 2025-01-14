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

import { PlotOfLandCreateDto, PlotOfLandDto, PlotOfLandUpdateDto, ProofDto } from '@forest-guard/api-interfaces';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Uris } from '../../uris';

@Injectable()
export class PlotOfLandService {
  constructor(private readonly httpClient: HttpClient) {}

  public getPlotOfLandById(id: string): Observable<PlotOfLandDto> {
    return this.httpClient.get<PlotOfLandDto>(`${environment.PLOTSOFLAND.URL}/${id}`);
  }

  public updatePlotOfLand(id: string, plotOfLandUpdate: PlotOfLandUpdateDto): Observable<PlotOfLandDto> {
    return this.httpClient.patch<PlotOfLandDto>(`${environment.PLOTSOFLAND.URL}/${id}`, plotOfLandUpdate);
  }

  public getProofsOfPlotOfLand(polId: string): Observable<ProofDto[]> {
    return this.httpClient.get<ProofDto[]>(`${environment.PLOTSOFLAND.URL}/${polId}${Uris.proofs}`);
  }

  public createProof(polId: string, formData: FormData): Observable<ProofDto> {
    return this.httpClient.post<ProofDto>(`${environment.PLOTSOFLAND.URL}/${polId}${Uris.proofs}`, formData);
  }

  public getPlotsOfLandByFarmerId(farmerId: string): Observable<PlotOfLandDto[]> {
    let params = new HttpParams();
    params = params.set('farmerId', farmerId);
    return this.httpClient.get<PlotOfLandDto[]>(environment.PLOTSOFLAND.URL, { params });
  }

  public createPlotOfLand(farmerId: string, plotOfLand: PlotOfLandCreateDto): Observable<PlotOfLandDto> {
    let params = new HttpParams();
    params = params.set('farmerId', farmerId);
    return this.httpClient.post<PlotOfLandDto>(environment.PLOTSOFLAND.URL, plotOfLand, { params });
  }
}
