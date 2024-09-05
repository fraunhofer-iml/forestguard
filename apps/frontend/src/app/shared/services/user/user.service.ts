import { FarmerCreateDto, FarmerDto, UserDto, UserOrFarmerDto, UserUpdateDto } from '@forest-guard/api-interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Uris } from '../../uris';

@Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public getUsers(): Observable<UserDto[]> {
    return this.httpClient.get<UserDto[]>(environment.USERS.URL);
  }

  public getUserById(id: string): Observable<UserOrFarmerDto> {
    return this.httpClient.get<UserOrFarmerDto>(`${environment.USERS.URL}/${id}`);
  }

  public createUser(user: UserUpdateDto): Observable<UserDto> {
    return this.httpClient.post<UserDto>(`${environment.USERS.URL}`, user);
  }

  public createFarmer(farmer: FarmerCreateDto): Observable<FarmerDto> {
    return this.httpClient.post<FarmerDto>(`${environment.USERS.URL}${Uris.farmers}`, farmer);
  }
}
