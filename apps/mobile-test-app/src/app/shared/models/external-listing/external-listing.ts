import { PRICING_MODE_ID } from '@mobile-test-app/constants/pricing-mode/pricing-mode';
import { trimZeroFromNumber } from '@mobile-test-app/helpers/format-number-helpers/format-number.helpers';

export class ExternalListingResponse {
  eventId: number;
  isError: boolean;
  lastListingUpdateUTC: string;
  listings: ExternalListing[];
  listingsCount: number;
  pricingMode: PRICING_MODE_ID;
  seatsCount: number;

  public static getDataFromAPI(data: ExternalListingResponseAPI): ExternalListingResponse {
    return {
      eventId: data.EventID,
      isError: data.IsError,
      lastListingUpdateUTC: data.LastListingUpdateUTC,
      listings: data.Listings.map(it => ExternalListing.getDataFromAPI(it)),
      listingsCount: data.ListingsCount,
      pricingMode: data.PricingMode,
      seatsCount: data.SeatsCount,
    };
  }
}

export class ExternalListingResponseAPI {
  EventID: number;
  IsError: boolean;
  LastListingUpdateUTC: string;
  Listings: ExternalListingAPI[];
  ListingsCount: number;
  PricingMode: PRICING_MODE_ID;
  SeatsCount: number;
}

export class ExternalListing {
  listingId: string;
  stubHubEventId: number;
  price: number;
  quantity: number;
  row: string;
  seatGeekEventId: number;
  sectionId: string;
  sectionName: string;
  splitVector: number[];
  stubHubSectionIds: string[];

  // FE only
  preparedPrice: string;
  preparedSplitVector?: string;
  isIgnore: boolean;

  public static getDataFromAPI(data: ExternalListingAPI): ExternalListing {
    return {
      listingId: data.ListingId,
      price: data.Price,
      quantity: data.Quantity,
      row: data.Row,
      stubHubEventId: data.StubhubEventId,
      seatGeekEventId: data.SeatGeekEventId,
      sectionId: data.SectionId,
      sectionName: data.SectionName,
      splitVector: data.SplitVector,
      stubHubSectionIds: data.StubhubSectionIds,

      // FE only
      preparedPrice: trimZeroFromNumber(data.Price),
      preparedSplitVector: data.SplitVector?.join(', '),
      isIgnore: false,
    };
  }
}

export class ExternalListingAPI {
  ListingId: string;
  Price: number;
  Quantity: number;
  Row: string;
  StubhubEventId: number;
  SeatGeekEventId: number;
  SectionId: string;
  SectionName: string;
  SplitVector: number[];
  StubhubSectionIds: string[];
}
