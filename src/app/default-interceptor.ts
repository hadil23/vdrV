// default-interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const responseBody = event.body;
          if (typeof responseBody === 'object' && 'message' in responseBody) {
            // Ignorer la vérification de la propriété code si la réponse est un objet JSON avec une propriété message
            return;
          }
          // Votre code actuel pour vérifier la propriété code
        }
      })
    );
  }
}