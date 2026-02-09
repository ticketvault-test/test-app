import { EventsFilters } from '../../../../shared/models/events/events';
import { EVENTS_MODE } from '../../../../shared/constants/events-mode/events-mode';
import { DATE_RANGE_TYPE_ID } from '../../../../shared/constants/date-range/date-range-type-id';

export interface EventsFiltersState {
  filters: EventsFilters;
  eventMode: EVENTS_MODE
}

export const initialEventsFiltersState: EventsFiltersState = {
  filters: {
    ...new EventsFilters(),
    includeParking: true,
    includeRegular: true,
    includeAvailable: true,
    eventSearchType: 0,
    selectedDateRange: DATE_RANGE_TYPE_ID.fourteenDays,
  },
  eventMode: EVENTS_MODE.pricing,
};
