import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode, provideAppInitializer } from '@angular/core';
import { appRoutes } from '../app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular({
      mode: 'ios',
      useSetInputAPI: true,
      swipeBackEnabled: false,
      scrollAssist: true,
      scrollPadding: true,
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
