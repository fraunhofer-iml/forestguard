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

import { FarmerCreateDto, UserCreateDto, UserDto, UserOrFarmerDto, UserUpdateDto } from '@forest-guard/api-interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Uris } from '../../uris';

@Injectable()
export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  public getUsers(): Observable<UserDto[]> {
    return this.httpClient.get<UserDto[]>(environment.USERS.URL);
  }

  public getUserById(id: string): Observable<UserOrFarmerDto> {
    return this.httpClient.get<UserOrFarmerDto>(`${environment.USERS.URL}/${id}`);
  }

  public createUser(user: UserCreateDto): Observable<UserDto> {
    return this.httpClient.post<UserDto>(`${environment.USERS.URL}`, user);
  }

  public createFarmer(farmer: FarmerCreateDto): Observable<UserOrFarmerDto> {
    return this.httpClient.post<UserOrFarmerDto>(`${environment.USERS.URL}${Uris.farmers}`, farmer);
  }

  public updateUser(id: string, user: UserUpdateDto): Observable<UserOrFarmerDto> {
    return this.httpClient.patch<UserOrFarmerDto>(`${environment.USERS.URL}/${id}`, user);
  }

  public addDocumentToUser(userId: string, file: File, description: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    return this.httpClient.post<Document>(`${environment.USERS.URL}/${userId}${Uris.document}`, formData);
  }

  public deleteDocumentById(userId: string, documentId: string) {
    return this.httpClient.delete(`${environment.USERS.URL}/${userId}${Uris.document}/${encodeURIComponent(documentId)}`);
  }
}
