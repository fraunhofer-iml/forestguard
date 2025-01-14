/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

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
