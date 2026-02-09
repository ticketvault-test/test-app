import { Performer, PerformerAPI } from '../performer/performer';
import { DATE_FORMATS } from '../../constants/date-formats/date-formats';
import { getFormattedDate } from '@mobile-test-app/helpers/date-helpers/date.helpers';

export class TicketGroupEvent {
  date: string | Date;
  dateAndTime: string | Date;
  eventId: number;
  eventNameFull: string;
  isActive: boolean;
  isParkingEvent: boolean;
  isSeatGeekBarcodeEvent: boolean;
  isSeatGeekBarcodeVenue: boolean;
  primaryPerformer: Performer;
  secondaryPerformer: Performer;
  time: string | Date;
  venueCity: string;
  venueID: number;
  venueName: string;
  viagogoEventDate: string | Date;
  viagogoEventID: number;
  viagogoEventName: string;
  viagogoPrimaryName: string;
  viagogoSecondaryName: string;
  viagogoVenueName: string;

  // FE only
  preparedDateAndTime: string;
  isViagogoEvent: boolean;

  public static getDataFromAPI(data: TicketGroupEventAPI): TicketGroupEvent {
    return {
      date: data.Date,
      dateAndTime: data.DateAndTime,
      eventId: data.EventID,
      eventNameFull: data.EventNameFull,
      isActive: data.IsActive,
      isParkingEvent: data.IsParkingEvent,
      isSeatGeekBarcodeEvent: data.IsSeatGeekBarcodeEvent,
      isSeatGeekBarcodeVenue: data.IsSeatGeekBarcodeVenue,
      primaryPerformer: Performer.getDataFromAPI(data.PrimaryPerformer),
      secondaryPerformer: Performer.getDataFromAPI(data.SecondaryPerformer),
      time: data.Time,
      venueCity: data.VenueCity,
      venueID: data.VenueID,
      venueName: data.VenueName,
      viagogoEventDate: data.ViagogoEventDate,
      viagogoEventID: data.ViagogoEventID,
      viagogoEventName: data.ViagogoEventName,
      viagogoPrimaryName: data.ViagogoPrimaryName,
      viagogoSecondaryName: data.ViagogoSecondaryName,
      viagogoVenueName: data.ViagogoVenueName,

      // FE only
      isViagogoEvent: !!data.ViagogoEventID,
      preparedDateAndTime: getFormattedDate(data.DateAndTime, DATE_FORMATS.eventsUIDate),
    };
  }
}

export class TicketGroupEventAPI {
  Date: string | Date;
  DateAndTime: string | Date;
  EventID: number;
  EventNameFull: string;
  IsActive: boolean;
  IsParkingEvent: boolean;
  IsSeatGeekBarcodeEvent: boolean;
  IsSeatGeekBarcodeVenue: boolean;
  PrimaryPerformer: PerformerAPI;
  SecondaryPerformer: PerformerAPI;
  Time: string | Date;
  VenueCity: string;
  VenueID: number;
  VenueName: string;
  ViagogoEventDate: string | Date;
  ViagogoEventID: number;
  ViagogoEventName: string;
  ViagogoPrimaryName: string;
  ViagogoSecondaryName: string;
  ViagogoVenueName: string;
}
