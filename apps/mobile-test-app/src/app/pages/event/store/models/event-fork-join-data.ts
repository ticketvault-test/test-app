import { EventItem } from '@mobile-test-app/models/events/events';
import { EventTicketGroup } from '@mobile-test-app/models/events/event-ticket-group';
import { ExternalListing } from '@mobile-test-app/models/external-listing/external-listing';

export class EventTicketGroupsForkJoinResult {
  ticketGroups: EventTicketGroup[];
  externalListings: ExternalListing[];
}

export class EventForkJoinResult {
  getEventInfo: EventItem;
  getEvents: EventItem[];
}
