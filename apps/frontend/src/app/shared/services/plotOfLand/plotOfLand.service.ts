import { PlotOfLandCreateDto, PlotOfLandDto, PlotOfLandUpdateDto, ProofDto } from '@forrest-guard/api-interfaces';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UploadFormSelectType } from '../../components/upload-form/upload-form-select.type';

@Injectable()
export class PlotOfLandService {
  constructor(private httpClient: HttpClient) {}

  public getPlotOfLandById(id: string): Observable<PlotOfLandDto> {
    return this.httpClient.get<PlotOfLandDto>(`${environment.PLOTSOFLAND.URL}/${id}`);
  }

  public updatePlotOfLand(id: string, plotOfLandUpdate: PlotOfLandUpdateDto): Observable<PlotOfLandDto> {
    return this.httpClient.patch<PlotOfLandDto>(`${environment.PLOTSOFLAND.URL}/${id}`, plotOfLandUpdate);
  }

  public getProofsOfPlotOfLand(polId: string): Observable<ProofDto[]> {
    return this.httpClient.get<ProofDto[]>(`${environment.PLOTSOFLAND.URL}/${polId}/proofs`);
  }

  public createProof(polId: string, formData: FormData): Observable<ProofDto> {
    return this.httpClient.post<ProofDto>(`${environment.PLOTSOFLAND.URL}/${polId}/proofs`, formData);
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
