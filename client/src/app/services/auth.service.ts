import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDto } from '../dtos/UserDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }


  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(res => {
          if (res.status === 200 && res.data) {
            this.currentUserSubject.next(res.data);
            this.isLoggedInSubject.next(true);
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
          this.isLoggedInSubject.next(false);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  checkAuthStatus(): Observable<UserDto | null> {
    return this.http.get<any>(`${this.apiUrl}/status`)
      .pipe(
        map(res => {
          if (res.data) {
            this.currentUserSubject.next(res.data);
            this.isLoggedInSubject.next(true);
            return res.data;
          } else {
            this.currentUserSubject.next(null);
            this.isLoggedInSubject.next(false);
            return null;
          }
        }),
        catchError(error => {
          this.isLoggedInSubject.next(false);
          this.currentUserSubject.next(null);
          return of(null);
        })
      );
  }

  get currentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
}

export function initializeAuth(authService: AuthService): Observable<any> {
  return authService.checkAuthStatus();
}
