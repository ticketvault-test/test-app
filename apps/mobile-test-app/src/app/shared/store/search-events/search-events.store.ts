import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';

import { withBaseStore } from '../../models/store/base.store';
import { initialSearchEventsState } from './search-events.state';
import { SEARCH_EVENTS_STORE_ACTIONS } from '../constants/actions';
import { SearchEvent } from '../../models/search-events/search-event';
import { GlobalSpinner } from '@mobile-test-app/models/global-spinner/global-spinner';
import { SearchEventsService } from '../../services/search-events.service/search-events.service';
import { GlobalSpinnerService } from '@mobile-test-app/services/global-spinner.service/global-spinner.service';

const searchEventsStoreFeatureKey = 'SearchEventsFeatureStore';

export const SearchEventsStore = signalStore(
  { providedIn: 'root' },
  withDevtools(searchEventsStoreFeatureKey),
  withBaseStore(),
  withState(initialSearchEventsState),

  withMethods((store) => {
    const globalSpinnerService = inject(GlobalSpinnerService);
    const searchEventsService = inject(SearchEventsService);

    const getSearchEvents = rxMethod<boolean>(
      pipe(
        tap((isForceReload: boolean): void => {
          if ((store.searchEvents().length === 0 || isForceReload) && !store.searchEventsPending()) {
            globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), loading: true, message: 'Loading...' });
            updateState(store, SEARCH_EVENTS_STORE_ACTIONS.getSearchEvents, { searchEventsPending: true });
          }
        }),
        switchMap((isForceReload: boolean) => {
          if (!isForceReload && store.searchEvents().length > 0 || !store.searchEventsPending()) {
            return EMPTY;
          }

          return searchEventsService.getSearchEvent$()
            .pipe(
              finalize(() => globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), loading: false })),
              tapResponse({
                next: (res: SearchEvent[]): void => {
                  updateState(
                    store,
                    SEARCH_EVENTS_STORE_ACTIONS.getSearchEventsSuccess,
                    { searchEvents: res, searchEventsPending: false },
                  );
                },
                error: (error: never): void => {
                  globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), loading: false });
                  updateState(store, SEARCH_EVENTS_STORE_ACTIONS.getSearchEventsFailure, { error, searchEventsPending: false });
                },
              }),
            );
        }),
      ),
    );

    return {
      getSearchEvents,
    };
  }),
);
