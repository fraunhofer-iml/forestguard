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

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Uris } from '../../uris';

@Injectable()
export class ProcessStepService {
  constructor(private readonly httpClient: HttpClient) {}

  public addDocToProcessStep(userId: string, file: File, description: string): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    return this.httpClient.post<Document>(`${environment.PROCESSSTEPS.URL}/${userId}${Uris.document}`, formData);
  }
}
