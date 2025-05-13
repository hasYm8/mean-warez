import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Role, UserDto } from '../dtos/User';
import { Response } from '../dtos/Response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + '/user';

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<UserDto[]> {
    return this.http.get<Response<UserDto[]>>(`${this.apiUrl}`)
      .pipe(
        map(res => res.data)
      );
  }

  delete(userId: string): Observable<any> {
    return this.http.delete<Response<any>>(`${this.apiUrl}/${userId}`)
      .pipe(
        map(res => res.data)
      );
  }

  update(user: UserDto): Observable<UserDto> {
    return this.http.patch<Response<UserDto>>(`${this.apiUrl}`, user)
      .pipe(
        map(res => res.data)
      );
  }

  updateRoles(userId: string, roles: Role[]): Observable<UserDto> {
    return this.http.patch<Response<UserDto>>(`${this.apiUrl}/role`, { userId: userId, roles: roles })
      .pipe(
        map(res => res.data)
      );
  }
}
