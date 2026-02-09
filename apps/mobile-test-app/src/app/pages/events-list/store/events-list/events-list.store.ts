import { inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { signalStore, type, withMethods } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { entityConfig, removeAllEntities, setAllEntities, withEntities } from '@ngrx/signals/entities';

import { EVENTS_STORE_ACTIONS } from '../constants/actions';
import { EventItem } from '../../../../shared/models/events/events';
import { withBaseStore } from '../../../../shared/models/store/base.store';
import { EventsFiltersStore } from '../events-list-filters/events-list-filter.store';
import { GlobalSpinner } from '@mobile-test-app/models/global-spinner/global-spinner';
import { EventsService } from '../../../../shared/services/events.service/events.service';
import { GlobalSpinnerService } from '@mobile-test-app/services/global-spinner.service/global-spinner.service';

const eventsStoreFeatureKey = 'EventsFeatureStore';

const eventsConfig = entityConfig({
  entity: type<EventItem>(),
  selectId: (e) => e.eventId,
});

export const EventsListStore = signalStore(
  { providedIn: 'root' },
  withDevtools(eventsStoreFeatureKey),
  withBaseStore(),
  withEntities<EventItem>(eventsConfig),

  withMethods((store) => {
    const eventsService = inject(EventsService);
    const eventsFiltersStore = inject(EventsFiltersStore);
    const globalSpinnerService = inject(GlobalSpinnerService);

    const clearStore = (): void => updateState(store, EVENTS_STORE_ACTIONS.clearStore, removeAllEntities());

    const getEvents = rxMethod<void>(
      pipe(
        tap((): void => {
          globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), message: 'Loading Events...', loading: true });
          updateState(store, EVENTS_STORE_ACTIONS.getEvents, { pending: true });
        }),
        switchMap(() =>
          eventsService.getEvents$(eventsFiltersStore.filters())
            .pipe(
              tapResponse({
                next: (res: EventItem[]): void => {
                  globalSpinnerService.setGlobalSpinnerState({ ...globalSpinnerService.globalSpinnerState(), loading: false });
                  updateState(
                    store,
                    EVENTS_STORE_ACTIONS.getEventsSuccess,
                    (state) => {
                      const next = setAllEntities(res, eventsConfig)(state);

                      return { ...next, pending: false };
                    },
                  );
                },
                error: (error: never): void => {
                  globalSpinnerService.setGlobalSpinnerState({ ...globalSpinnerService.globalSpinnerState(), loading: false });
                  updateState(store, EVENTS_STORE_ACTIONS.getEventsFailure, { error, pending: false });
                },
              }),
            ),
        ),
      ),
    );

    return {
      getEvents,
      clearStore,
    };
  }),
);
