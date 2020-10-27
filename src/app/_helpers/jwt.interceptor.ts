import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthServiceService} from '../_services/auth-service.service';





export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthServiceService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    // @ts-ignore
    if (currentUser && currentUser.access_token) {
      request = request.clone({
        // add Token and app/json to header
        setHeaders: {
          // @ts-ignore
          Authorization: `Bearer ${currentUser.access_token}`,
          Accept: `application/json`
        }
      });
    }
    return next.handle(request);
  }
}
