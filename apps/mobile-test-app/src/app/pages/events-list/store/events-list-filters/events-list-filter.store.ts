import { signalStore, withMethods, withState } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';

import { EVENTS_FILTERS_STORE_ACTIONS } from '../constants/actions';
import { EventsFilters } from '../../../../shared/models/events/events';
import { EVENTS_MODE } from '@mobile-test-app/constants/events-mode/events-mode';
import { EventsFiltersState, initialEventsFiltersState } from './events-list-filter.state';

const eventsFiltersStoreFeatureKey = 'EventsFiltersStore';

export const EventsFiltersStore = signalStore(
  { providedIn: 'root' },
  withState<EventsFiltersState>(initialEventsFiltersState),
  withDevtools(eventsFiltersStoreFeatureKey),

  withMethods((store) => {
    const clearStore = (): void => updateState(store, EVENTS_FILTERS_STORE_ACTIONS.clearStore, () => initialEventsFiltersState);

    const setFilterField = <K extends keyof EventsFilters>(key: K, value: EventsFilters[K]): void => {
      updateState(store, EVENTS_FILTERS_STORE_ACTIONS.setFilterField, (state) => ({
        ...state,
        filters: {
          ...state.filters,
          [key]: value,
        },
      }));
    };

    const changeEventMode = (eventMode: EVENTS_MODE): void =>
      updateState(store, EVENTS_FILTERS_STORE_ACTIONS.changeEventMode, () => ({ eventMode }));

    const setFilters = (filters: EventsFilters): void =>
      updateState(store, EVENTS_FILTERS_STORE_ACTIONS.setFilters, (state) => ({ ...state, filters: { ...state.filters, ...filters as EventsFilters } }));

    return {
      setFilters,
      clearStore,
      setFilterField,
      changeEventMode,
    };
  }),
);
