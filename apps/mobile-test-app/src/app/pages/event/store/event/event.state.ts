import { EventItem } from '../../../../shared/models/events/events';
import { ExternalListing } from '@mobile-test-app/models/external-listing/external-listing';

export interface EventState {
  eventItem: EventItem;
  externalEventListings: ExternalListing[];
  externalEventListingsPending: boolean;
  eventTicketGroupsWithListingsPending: boolean;
}

export const initialEventState: EventState = {
  eventItem: null,
  externalEventListings: [],
  externalEventListingsPending: false,
  eventTicketGroupsWithListingsPending: false,
};
