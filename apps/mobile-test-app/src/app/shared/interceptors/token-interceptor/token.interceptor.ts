import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { PAGE_URL } from '@mobile-test-app/constants/pages/pages';
import { HTTP_ERROR_STATUSES } from '@mobile-test-app/constants/http-error/http-error';
import { LogoutService } from '@mobile-test-app/services/logout.service/logout.service';
import { AuthenticationService } from '@mobile-test-app/services/authentication.service/authentication.service';

const EXCLUDED_ADD_TOKEN_URLS = ['public', 'assets'];
const REFRESH_RETRY_HEADER = 'X-Refresh-Retry';

export const tokenInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const logoutService = inject(LogoutService);
  const authenticationService = inject(AuthenticationService);

  if (!isRequestWithToken(request.url)) {
    return next(request);
  }

  const accessToken = '';

  return next(getRequestWithToken(request, accessToken)).pipe(
    catchError(response => {
      if (response instanceof HttpErrorResponse && response.status === HTTP_ERROR_STATUSES.unauthorized && !request.headers.has(REFRESH_RETRY_HEADER)) {
        return authenticationService.getRefreshToken$(response).pipe(
          switchMap(token => next(
            request.clone({ setHeaders: { Authorization: `Bearer ${token}`, [REFRESH_RETRY_HEADER]: 'true' } }),
          )),
        );
      }

      if (response instanceof HttpErrorResponse && request.headers.has(REFRESH_RETRY_HEADER)) {
        logoutService.logout();

        return throwError(response);
      }

      return throwError(response);
    }),
  );
};

function isRequestWithToken(url: string): boolean {
  return !EXCLUDED_ADD_TOKEN_URLS.some(it => url.toLowerCase().includes(it.toLowerCase())) && isPagesWithToken();
}

function isPagesWithToken(): boolean {
  return !window.location.href.includes(PAGE_URL.authentication);
}

function getRequestWithToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
}
