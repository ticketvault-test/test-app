import { inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { AppSettingsService } from '../../services/app-settings.service/app-settings.service';
import { isSkipGettingAppSettings } from '@mobile-test-app/helpers/app-settings-helpers/app-config.helper';

export const versionInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (isSkipGettingAppSettings(request.url)) return next(request);

  const appVersionService = inject(AppSettingsService);

  return appVersionService
    .getAppSettings$()
    .pipe(switchMap(envConfig => {
      const baseHttpEvent = new Observable<HttpEvent<unknown>>();

      const newAppVersion: string = envConfig.appVersion;
      const currentEnvConfig: string = appVersionService.getStoredVersion();

      if (!currentEnvConfig) {
        appVersionService.setStoredVersion(newAppVersion);

        return next(request);
      }

      if (currentEnvConfig !== newAppVersion) {
        appVersionService.setStoredVersion(newAppVersion);
        location.reload();

        return baseHttpEvent;
      }

      appVersionService.setStoredVersion(newAppVersion);

      return next(request);
    }));
};
