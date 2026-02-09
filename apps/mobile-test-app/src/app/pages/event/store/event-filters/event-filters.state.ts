import { EventsFilters } from '@mobile-test-app/models/events/events';

export interface EventFiltersState extends EventsFilters {
  productionId: number;
  includeAvailable: boolean;
  includeExpired: boolean;
  includeParking: boolean;
  includeRegular: boolean;
  includeSold: boolean;
  includeSoldInfo: boolean;
}

export const initialEventFiltersState: EventFiltersState = {
  ...new EventsFilters(),
};
