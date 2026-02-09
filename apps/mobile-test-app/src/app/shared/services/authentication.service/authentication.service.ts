import { inject, Injectable } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, map, Observable, shareReplay, Subscription, tap, throwError, timer } from 'rxjs';

import { UrlService } from '../url.service/url.service';
import { TIME_IN_MS } from '@mobile-test-app/constants/time/time';
import { STORAGE_KEYS } from '@mobile-test-app/constants/storage/storage';
import { LoginModel, LoginModelAPI } from '../../models/login-model/login-model';
import { ErrorHandlingService } from '../error-handling.service/error-handling.service';
import { HTTP_ERROR_STATUSES } from '@mobile-test-app/constants/http-error/http-error';
import { LogoutService } from '@mobile-test-app/services/logout.service/logout.service';
import { LoginResponse, LoginResponseAPI } from '../../models/login-response/login-response';
import { RequestService } from '@mobile-test-app/services/request.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly urlService = inject(UrlService);
  private readonly requestService = inject(RequestService);
  private readonly logoutService = inject(LogoutService);
  private readonly errorHandlingService = inject(ErrorHandlingService);

  private refresh$: Subscription | null = null;
  private refreshInProgress$: Observable<string> | null = null;

  private readonly REFRESH_TOKEN_TIMER_BEFORE_EXP = TIME_IN_MS.fiveMinutes;

  public login$(login: LoginModel): Observable<LoginResponse> {
    return this.requestService.post(this.urlService.getLoginURL(), LoginModelAPI.getDataForAPI(login))
      .pipe(
        map((res: LoginResponseAPI): LoginResponse => LoginResponse.getDataFromAPI(res)),
        tap((res: LoginResponse) => {
          // this.storageService.set(STORAGE_KEYS.token, res.token);
          // this.storageService.set(STORAGE_KEYS.userData, res);
        }),
      );
  }

  public forgotPasswordRequest$(userName: string): Observable<unknown> {
    return this.requestService.post(this.urlService.getForgotPasswordURL(), { userName })
      .pipe(catchError((err) => this.errorHandlingService.handleError(err)));
  }

  public getRefreshToken$(response?: HttpErrorResponse): Observable<string> {
    if (this.refreshInProgress$) {
      return this.refreshInProgress$;
    }

    this.refreshInProgress$ = this.requestService.get(this.urlService.getRefreshTokenURL())
      .pipe(
        map(token => {
          if (!token) {
            if (response) {
              throw response;
            }

            throw new HttpErrorResponse({
              status: HTTP_ERROR_STATUSES.unauthorized,
              statusText: 'Unauthorized',
              error: 'Empty refresh token',
            });
          }

          // this.storageService.set(STORAGE_KEYS.token, token);

          return token;
        }),
        catchError(err => {
          this.logoutService.logout();

          return throwError(() => err);
        }),
        shareReplay(1),
        finalize(() => this.refreshInProgress$ = null),
      );

    return this.refreshInProgress$;
  }

  public startAutoRefresh(): void {
    this.stopAutoRefresh();

    // const accessToken = this.storageService.get(STORAGE_KEYS.token);

    // if (!accessToken) return;
    //
    // const msToRefresh = this.getMsToRefresh(accessToken);
    //
    // if (!msToRefresh) {
    //   this.refreshTokenAndReschedule();
    //
    //   return;
    // }
    //
    // this.refresh$ = timer(msToRefresh).subscribe(() => {
    //   this.refreshTokenAndReschedule();
    // });
  }

  public stopAutoRefresh(): void {
    if (this.refresh$) {
      this.refresh$.unsubscribe();
      this.refresh$ = null;
    }
  }

  private refreshTokenAndReschedule(): void {
    this.getRefreshToken$().subscribe((newToken: string) => {
      if (!newToken) return;

      this.startAutoRefresh();
    });
  }

  private getMsToRefresh(jwtToken: string): number {
    try {
      const token = jwtDecode<JwtPayload & { iat?: number }>(jwtToken);

      if (!token.exp || !token.iat) return 0;

      return Math.max(token.exp * 1000 - Date.now() - this.REFRESH_TOKEN_TIMER_BEFORE_EXP, 0);
    } catch { // handle invalid decoding token
      return 0;
    }
  }
}
