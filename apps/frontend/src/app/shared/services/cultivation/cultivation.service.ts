import { CultivationDto } from '@forest-guard/api-interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CultivationService {
  constructor(private readonly httpClient: HttpClient) {}

  readCultivationsByCommodity(type: string): Observable<CultivationDto[]> {
    return this.httpClient.get<CultivationDto[]>(`${environment.CULTIVATIONS.URL}?commodity=${type}`);
  }
}
