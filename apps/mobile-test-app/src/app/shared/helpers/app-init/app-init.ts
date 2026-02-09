import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, take, tap } from 'rxjs';

import { PAGE_URL } from '../../constants/pages/pages';
import { SwUpdate, VersionEvent, VersionReadyEvent } from '@angular/service-worker';
import { SW_UPDATE_TYPES } from '@mobile-test-app/constants/service-workes/sw-update-types';

export function appInitFunc() {
  return () => {
    const router = inject(Router);
    const swUpdate = inject(SwUpdate, { optional: true });

    swUpdate.versionUpdates.pipe(
      filter((e: VersionEvent): e is VersionReadyEvent => {
        console.log(e.type);

        return e.type === SW_UPDATE_TYPES.versionReady;
      }),
      take(1),
      tap(() => location.reload()),
    ).subscribe();

    const token = '';

    if (!token && !window.location.href.includes(PAGE_URL.authentication)) {
      router.navigate([PAGE_URL.authentication]);

      return Promise.resolve();
    }

    return Promise.resolve();
  };

}
