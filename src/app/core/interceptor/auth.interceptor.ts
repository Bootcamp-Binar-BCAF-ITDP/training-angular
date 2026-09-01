// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { AuthService } from '../service/auth/auth.service';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const token = authService.getToken();

//   if (token) {
//     const cloned = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return next(cloned);
//   }

//   return next(req);
// };

import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const REQUIRES_AUTH = new HttpContextToken<boolean>(() => false);
  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);

  if (!request.context.get(REQUIRES_AUTH) || !token) {
    return next(request);
  }
  const authenticatedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/forbidden'], { replaceUrl: true });
      }

      return throwError(() => error);
    }),
  );
};
