import { EventItem } from '@mobile-test-app/models/events/events';
import { DATE_FORMATS } from '@mobile-test-app/constants/date-formats/date-formats';
import { getFormattedDate } from '@mobile-test-app/helpers/date-helpers/date.helpers';

export function getListingPopupMessage(): string {
  return '<div class="_p-6">Listings/Tickets</div>';
}

export function getTotalCostPopupMessage(): string {
  return '<div class="_p-6">Total cost of available tickets</div>';
}

export function getEventPopupMessage(event: EventItem): string {
  const dateValue = event.ticketGroupEvent.isViagogoEvent
    ? event.ticketGroupEvent.viagogoEventDate
    : event.ticketGroupEvent.date;

  const venueName = event.ticketGroupEvent.isViagogoEvent
    ? event.ticketGroupEvent.viagogoVenueName
    : event.ticketGroupEvent.venueName;

  const formattedDate = getFormattedDate(dateValue, DATE_FORMATS.eventsUIDate);

  return `
    <div class="_d-f _f-dir-col _p-6">
      <div class="_d-f _f-align-center _justify-between">
        <span class="_fs-14 _fw-500 _text-color-white">${event.fullEventName}</span>
        <span class="_fs-14 _white-space-nowrap _opacity-5 _ml-10">${formattedDate}</span>
      </div>
      <span class="_fs-14 _opacity-5 _mt-12">${venueName}</span>
    </div>
  `;
}
