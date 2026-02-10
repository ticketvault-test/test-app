import { DATE_RANGE_TYPE_ID } from '../../constants/date-range/date-range-type-id';
import { SearchEvent } from '@mobile-test-app/models/search-events/search-event';
import { getUserUILocaleTimeZone } from '@mobile-test-app/helpers/date-helpers/date.helpers';
import { TicketGroupEvent, TicketGroupEventAPI } from '../ticket-group-event/ticket-group-event';
import { trimZeroFromNumber } from '@mobile-test-app/helpers/format-number-helpers/format-number.helpers';

export class EventsFilters {
  endDate: Date;
  eventId: number;
  eventSearchType: number;
  excludeTags: number[];
  includeAvailable: boolean;
  includeBroadcasted: boolean;
  includeExpired: boolean;
  includeParking: boolean;
  includeRegular: boolean;
  includeSold: boolean;
  includeSoldInfo: boolean;
  includeTags: number[];
  includeUnbroadcasted: boolean;
  listingsAtFloor: boolean;
  listingsWithNoComps: boolean;
  noCriteriaSet: boolean;
  performerTypeIDs: number[];
  productionId: number;
  showFloorsAbove: number;
  startDate: Date;
  venueId: number;

  // FE only
  selectedDateRange: DATE_RANGE_TYPE_ID;
  searchEvent?: SearchEvent;
}

export class EventsFiltersAPI {
  EndDate: string;
  EventId: number;
  EventSearchType: number;
  ExcludeTags: number[];
  IncludeAvailable: boolean;
  IncludeBroadcasted: boolean;
  IncludeExpired: boolean;
  IncludeParking: boolean;
  IncludeRegular: boolean;
  IncludeSold: boolean;
  IncludeSoldInfo: boolean;
  IncludeTags: number[];
  IncludeUnbroadcasted: boolean;
  ListingsAtFloor: boolean;
  ListingsWithNoComps: boolean;
  NoCriteriaSet: boolean;
  PerformerTypeIDs: number[];
  ProductionId: number;
  ShowFloorsAbove: number;
  StartDate: string;
  UiTimeZone: string;
  VenueId: number;

  public static prepareDataForAPI(data: EventsFilters): EventsFiltersAPI {
    return {
      EventId: data.eventId,
      EventSearchType: data.eventId ? data.eventSearchType : null,
      ExcludeTags: data.excludeTags && data.excludeTags.length > 0 ? data.excludeTags.map((x) => +x) : null,
      IncludeAvailable: data.includeAvailable,
      IncludeBroadcasted: data.includeBroadcasted,
      IncludeExpired: data.includeExpired,
      IncludeParking: data.includeParking,
      IncludeRegular: data.includeRegular,
      IncludeSold: data.includeSold,
      IncludeSoldInfo: data.includeSoldInfo,
      IncludeTags: data.includeTags && data.includeTags.length > 0 ? data.includeTags.map((x) => +x) : null,
      IncludeUnbroadcasted: data.includeUnbroadcasted,
      ListingsAtFloor: data.listingsAtFloor,
      ListingsWithNoComps: data.listingsWithNoComps,
      NoCriteriaSet: data.noCriteriaSet,
      PerformerTypeIDs: data.performerTypeIDs ?? [],
      ProductionId: data.productionId,
      ShowFloorsAbove: data.showFloorsAbove,
      UiTimeZone: getUserUILocaleTimeZone(),
      VenueId: data.venueId,
      StartDate: null,
      EndDate: null,
    };
  }
}

export class EventItemAPI {
  Currency: string;
  EventId: number;
  ExportEventNameOverride: string;
  ExportPrimaryPerformerName: string;
  ExportSecondaryPerformerName: string;
  IsGameTimeBarcodeEvent: boolean;
  IsParkingEvent: boolean;
  IsSeatGeekBarcodeEvent: boolean;
  IsSeatGeekBarcodeVenue: boolean;
  IsStubhubBarcodeEvent: boolean;
  IsTevoBarcodeEvent: boolean;
  IsTickPickBarcodeEvent: boolean;
  IsTmBarcodeEvent: boolean;
  IsViagogoBarcodeEvent: boolean;
  MyInventoryCost: number;
  MyInventoryQuantity: number;
  SalesTotal: number;
  Sold24: number;
  Sold72: number;
  SoldWeek: number;
  StubhubEventID: string;
  SeatGeekEventID: string;
  StubhubRemaining: number;
  TMEventID: string;
  VividEventID: string;
  Tags: number[];
  TicketGroupCount: number;
  TicketGroupEvent: TicketGroupEventAPI;
}

export class EventItem {
  currency: string;
  eventId: number;
  exportEventNameOverride: string;
  exportPrimaryPerformerName: string;
  exportSecondaryPerformerName: string;
  isParkingEvent: boolean;
  myInventoryCost: number;
  myInventoryQuantity: number;
  salesTotal: number;
  sold24: number;
  sold72: number;
  soldWeek: number;
  stubHubRemaining: number;
  stubHubEventID: string;
  vividEventId: string;
  seatGeekEventId: string;
  tags: number[];
  ticketGroupCount: number;
  ticketGroupEvent: TicketGroupEvent;
  tmEventId: string;

  // FE only
  fullEventName: string;
  preparedMyInventoryCost: string;

  public static getDataFromAPI(data: EventItemAPI): EventItem {
    if (!data) return null;

    return {
      currency: data.Currency,
      eventId: data.EventId,
      exportEventNameOverride: data.ExportEventNameOverride,
      exportPrimaryPerformerName: data.ExportPrimaryPerformerName,
      exportSecondaryPerformerName: data.ExportSecondaryPerformerName,
      isParkingEvent: data.IsParkingEvent,
      myInventoryCost: data.MyInventoryCost,
      myInventoryQuantity: data.MyInventoryQuantity,
      salesTotal: data.SalesTotal,
      sold24: data.Sold24,
      sold72: data.Sold72,
      soldWeek: data.SoldWeek,
      stubHubRemaining: data.StubhubRemaining,
      tmEventId: data.TMEventID,
      vividEventId: data.VividEventID,
      seatGeekEventId: data.SeatGeekEventID,
      stubHubEventID: data.StubhubEventID,
      tags: data.Tags,
      ticketGroupCount: data.TicketGroupCount,
      ticketGroupEvent: TicketGroupEvent.getDataFromAPI(data.TicketGroupEvent),

      // FE only
      fullEventName: EventItem.getEventTooltip(data),
      preparedMyInventoryCost: trimZeroFromNumber(data.MyInventoryCost),
    };
  }

  private static getEventTooltip(data: EventItemAPI): string {
    const isViagogoEvent = !!data.TicketGroupEvent?.ViagogoEventID;

    const primaryEventName = isViagogoEvent && data.ExportPrimaryPerformerName
      ? data.ExportPrimaryPerformerName
      : data.TicketGroupEvent?.PrimaryPerformer?.Name;

    const secondaryEventName = isViagogoEvent
      ? data.ExportSecondaryPerformerName
      : data.TicketGroupEvent?.SecondaryPerformer?.Name;

    return (
      `${data.IsParkingEvent ? '(PARKING)' : ''}` +
      `${secondaryEventName ? `${secondaryEventName.toUpperCase()}  At ` : ''}${'<b>' + primaryEventName.toUpperCase() + '</b>'}\n`
    );
  }
}
