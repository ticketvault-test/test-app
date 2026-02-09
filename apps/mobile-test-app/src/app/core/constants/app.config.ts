import { provideRouter } from '@angular/router';
import { createAnimation } from '@ionic/angular';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideServiceWorker } from '@angular/service-worker';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode, provideAppInitializer } from '@angular/core';

import { appRoutes } from './app.routes';
import { appInitFunc } from '../../shared/helpers/app-init/app-init';
import { PLATFORM_MODE } from '../../shared/constants/platform-mode/platform-mode';
import { tokenInterceptor } from '../../shared/interceptors/token-interceptor/token.interceptor';
import { versionInterceptor } from '../../shared/interceptors/version-interceptor/version.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(appInitFunc()),
    provideHttpClient(
      withInterceptors([tokenInterceptor, versionInterceptor]),
    ),
    provideIonicAngular({
      mode: PLATFORM_MODE.ios,
      useSetInputAPI: true,
      swipeBackEnabled: false,
      scrollAssist: true,
      scrollPadding: true,
      modalLeave: (baseEl, opts) =>
        createAnimation()
          .addElement(baseEl)
          .duration(100)
          .fromTo('opacity', '1', '0'),
      popoverLeave: (baseEl, opts) =>
        createAnimation()
          .addElement(baseEl)
          .duration(100)
          .fromTo('opacity', '1', '0'),
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideEnvironmentNgxMask(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
