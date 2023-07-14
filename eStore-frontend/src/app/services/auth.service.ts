import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  login(data: any): Observable<any> {
    return this.httpClient.post(environment.BASE_URL + 'login', data);
  }
  signUp(data: any): Observable<any> {
    return this.httpClient.post(environment.BASE_URL + 'signUp', data);
  }
  logOut(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
