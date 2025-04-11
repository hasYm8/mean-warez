import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private serviceApiUrl = environment.apiUrl + '/auth';

  registerService(registerObj: any) {
    return this.http.post<any>(`${this.serviceApiUrl}/register`, registerObj);
  }

  loginService(loginObj: any) {
    return this.http.post<any>(`${this.serviceApiUrl}/login`, loginObj);
  }

  isLoggedIn() {
    return !!localStorage.getItem("user_id");
  }
}
