import { computed } from '@angular/core';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { initialEventFiltersState } from './event-filters.state';
import { EVENT_FILTERS_STORE_ACTIONS } from '../constants/actions';
import { EventsFilters } from '@mobile-test-app/models/events/events';

const eventFiltersStoreFeatureKey = 'EventFiltersFeatureStore';

export const EventFiltersStore = signalStore(
  { providedIn: 'root' },
  withDevtools(eventFiltersStoreFeatureKey),
  withState(initialEventFiltersState),

  withComputed((state) => ({
    filters: computed(() => ({
      productionId: state.productionId(),
      includeAvailable: state.includeAvailable(),
      includeExpired: state.includeExpired(),
      includeParking: state.includeParking(),
      includeRegular: state.includeRegular(),
      includeSold: state.includeSold(),
      includeSoldInfo: state.includeSoldInfo(),
    } as EventsFilters)),
  })),

  withMethods((store) => {
    const clearStore = (): void => updateState(store, EVENT_FILTERS_STORE_ACTIONS.clearStore, initialEventFiltersState);

    const setEventItemFilters = (filters: EventsFilters): void =>
      updateState(store, EVENT_FILTERS_STORE_ACTIONS.setFilters, (state) => ({ ...state, ...filters }));

    return {
      clearStore,
      setEventItemFilters,
    };
  }),
);
