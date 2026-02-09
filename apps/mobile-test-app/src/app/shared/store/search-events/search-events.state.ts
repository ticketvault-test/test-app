import { SearchEvent } from '../../models/search-events/search-event';

export interface SearchEventsState {
  searchEvents: SearchEvent[];
  searchEventsPending: boolean;
}

export const initialSearchEventsState: SearchEventsState = {
  searchEvents: [],
  searchEventsPending: false,
};
