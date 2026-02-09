import { NavController } from '@ionic/angular/standalone';
import { inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { merge, fromEvent, Subject, Subscription, timer, map } from 'rxjs';
import { filter, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { TIME_IN_MS } from '@mobile-test-app/constants/time/time';
import { PAGE_URL } from '@mobile-test-app/constants/pages/pages';
import { EVENT_NAME } from '@mobile-test-app/constants/event-name/event-name';
import { AppSettings } from '@mobile-test-app/models/app-settings/app-settings';
import { AppSettingsService } from '@mobile-test-app/services/app-settings.service/app-settings.service';

@Injectable({ providedIn: 'root' })
export class MonitoringActivityService implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly navController = inject(NavController);
  private readonly appSettingsService = inject(AppSettingsService);

  private readonly destroy$ = new Subject<void>();

  private readonly TIMER_BEFORE_LOGOUT = TIME_IN_MS.fiveMinutes;

  private activitySubscription?: Subscription;

  public ngOnDestroy(): void {
    this.stop();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public stop(): void {
    this.activitySubscription?.unsubscribe();
    this.activitySubscription = undefined;
  }

  public start(nonActivityAction: () => void): void {
    this.stop();

    const activity$ = merge(
      fromEvent(document, EVENT_NAME.touchStart),
      fromEvent(document, EVENT_NAME.touchMove),
      fromEvent(document, EVENT_NAME.click),
      fromEvent(document, EVENT_NAME.keyDown),
      fromEvent(window, EVENT_NAME.scroll),
      fromEvent(window, EVENT_NAME.mouseMove),
      fromEvent(window, EVENT_NAME.focus),
    ).pipe(map(() => EVENT_NAME.activity));

    const hidden$ = fromEvent(document, EVENT_NAME.visibilitychange).pipe(
      filter(() => document.visibilityState === EVENT_NAME.hidden),
      map(() => EVENT_NAME.hidden),
    );

    const visible$ = fromEvent(document, EVENT_NAME.visibilitychange).pipe(
      filter(() => document.visibilityState === EVENT_NAME.visible),
      switchMap(() => this.appSettingsService.getAppSettings$()),
      tap((envConfig: AppSettings) => {
        const newVersion = envConfig.appVersion;
        const storedVersion = this.appSettingsService.getStoredVersion();

        if (!storedVersion) {
          this.appSettingsService.setStoredVersion(newVersion);
          return;
        }

        if (storedVersion !== newVersion) {
          this.appSettingsService.setStoredVersion(newVersion);
          location.reload();
        }
      }),
      map(() => EVENT_NAME.visible),
    );

    this.zone.runOutsideAngular(() => {
      this.activitySubscription = merge(activity$, hidden$, visible$)
        .pipe(
          startWith(EVENT_NAME.activity),
          switchMap((evt: EVENT_NAME) => timer(this.TIMER_BEFORE_LOGOUT).pipe(map(() => evt))),
          takeUntil(this.destroy$),
          tap(() => {
            this.zone.run(() => {
              try {
                nonActivityAction();
              } finally {
                this.navController.navigateRoot([PAGE_URL.login], { replaceUrl: true });
              }
            });
          }),
        )
        .subscribe();
    });
  }
}
