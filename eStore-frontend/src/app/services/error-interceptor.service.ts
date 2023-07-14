import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url != environment.BASE_URL + 'login') {
      return next.handle(req).pipe(
        catchError((err) => {
          const code = err?.error?.code || '';
          if (code === 'Token missing!' || code === 'Invalid Token!') {
            // this.router.navigate(['login']);
          }
          const error = err.error.message || err.statusText;
          return throwError(() => new Error(error));
        })
      );
    }
    return next.handle(req);
  }
}
