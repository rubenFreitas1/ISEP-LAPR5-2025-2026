import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth0: Auth0Service) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor - Original request body:', req.body);
    console.log('AuthInterceptor - Request URL:', req.url);
    console.log('AuthInterceptor - Content-Type:', req.headers.get('Content-Type'));
    
    return from(
      this.auth0.getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://lapr5-api',
          scope: 'openid profile email'
        }
      })
    ).pipe(
      switchMap(token => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('AuthInterceptor - Cloned request body:', authReq.body);
        return next.handle(authReq);
      })
    );
  }
}
