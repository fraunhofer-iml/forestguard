import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  FarmerCreateDto,
  FarmerDto,
  UserDto,
  UserUpdateDto
} from '@forrest-guard/api-interfaces';
import { Uris } from '../../uris';

@Injectable()
export class UserService {
  constructor(
    private httpClient: HttpClient
) {}

  public getUsers(): Observable<UserDto[]> {
    return this.httpClient.get<UserDto[]>(environment.USERS.URL);
  }

  public getUserById(id: string): Observable<UserDto> {
    return this.httpClient.get<UserDto>(`${environment.USERS.URL}/${id}`);
  }

  public createUser(user: UserUpdateDto): Observable<UserDto> {
    return this.httpClient.patch<UserDto>(`${environment.USERS.URL}`, user);
  }

  public createFarmer(farmer: FarmerCreateDto): Observable<FarmerDto> {
    return this.httpClient.post<FarmerDto>(`${environment.USERS.URL}${Uris.farmers}`, farmer);
  }
}
