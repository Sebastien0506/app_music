import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { inject } from "@angular/core";


export function errorInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
    console.log(req.url);
    const router = inject(Router);

    return next(req).pipe(
        catchError((err) => {
            if(err.status === 500) {
                router.navigate(['/page500']);
            }
            if(err.status === 403) {
                router.navigate(['/page403']);
            }
            
            return throwError(() => err);
        })
    );
}


