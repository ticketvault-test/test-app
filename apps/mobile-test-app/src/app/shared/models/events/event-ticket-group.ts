import { getUserUILocaleTimeZone } from '@mobile-test-app/helpers/date-helpers/date.helpers';
import { PricingRule, PricingRuleAPI } from '@mobile-test-app/models/pricing-rule/pricing-rule';
import { trimZeroFromNumber } from '@mobile-test-app/helpers/format-number-helpers/format-number.helpers';
import { fillMatchRows, fillPrice } from '@mobile-test-app/helpers/event-ticket-group-helpers/event-ticket-group.helpers';

export class EventTicketGroupResponse {
  isLimitShare: boolean;
  blockId: number;
  blockName: string;
  maxShare: number;
  lowCMP: number;
  cMPs: number;
  delete: boolean;
  isNoComps: boolean;
  pricingRule: PricingRule;
  ticketGroups: EventTicketGroup[];

  public static getDataFromAPI(data: EventTicketGroupResponseAPI): EventTicketGroupResponse {
    let pricingRule = new PricingRule();

    if (data.PricingRule) {
      pricingRule = PricingRule.getDataFromAPI(data.PricingRule);
    }

    let ticketGroups: EventTicketGroup[] = [];

    if (data.BlockId && data.TicketGroups && data.TicketGroups.length > 0) {
      const firstTicketGroup = data.TicketGroups[0];
      const listingCount = data.TicketGroups.filter(group => group.UserShNetworksList.length).length;

      ticketGroups = [{
        ...EventTicketGroup.getDataFromAPI(firstTicketGroup),
        blockName: data.BlockName,
        blockId: data.BlockId,
        floor: pricingRule?.floor ?? null,
        preparedFloor: trimZeroFromNumber(pricingRule?.floor ?? null),
        listing: listingCount,
        ticketGroupIds: data.TicketGroups.map(ticketGroup => ticketGroup.TicketGroupID),
      }];
    } else {
      ticketGroups = data.TicketGroups && data.TicketGroups.length
        ? data.TicketGroups.map((it, index) => ({
          ...EventTicketGroup.getDataFromAPI(it),
          sortRank: index + 1,
        }))
        : [];
      const listingCount = ticketGroups.filter(group => group.blockId && group.userShNetworks).length;

      ticketGroups = ticketGroups.map(group => ({ ... group, listing: listingCount }));
    }

    if (data.PricingRule) {
      ticketGroups = fillPrice(ticketGroups, pricingRule);
    }

    fillMatchRows(pricingRule, data.PricingRule);

    return {
      isLimitShare: data.IsLimitShare,
      blockId: data.BlockId,
      blockName: data.BlockName,
      maxShare: data.MaxShare,
      lowCMP: data.LowCMP,
      cMPs: data.CMPs,
      isNoComps: true,
      delete: data.Delete,
      pricingRule,
      ticketGroups,
    };
  }
}

export class EventTicketGroupResponseAPI {
  IsLimitShare: boolean;
  BlockId: number;
  BlockName: string;
  MaxShare: number;
  LowCMP: number;
  CMPs: number;
  Delete: boolean;
  PricingRule: PricingRuleAPI;
  TicketGroups: EventTicketGroupAPI[];

  public static prepareDataForAPI(eventTicketGroup: EventTicketGroup): EventTicketGroupResponseAPI {
    return {
      ...new EventTicketGroupResponseAPI(),
      BlockName: eventTicketGroup.blockName,
      BlockId: eventTicketGroup.blockId,
      Delete: eventTicketGroup.isDelete,
      MaxShare: eventTicketGroup.maxShare,
      IsLimitShare: eventTicketGroup.isLimitShare,
      PricingRule: PricingRuleAPI.prepareDataFromEventTicketGroupForAPI(eventTicketGroup),
    };
  }
}

export class EventTicketGroup {
  barcodesCount: number;
  companyID: number;
  cost: number;
  deliveryTypeId: number;
  documentsCount: number;
  endSeat: number;
  holdDateTimeUTC: string;
  holdExpirationDateTimeUTC: string;
  holdForClientID: number;
  inHandDate: string;
  isConsecutive: boolean;
  isDirtyMarketPrice: boolean;
  isFullyMapped: boolean;
  isGeneralAdmission: boolean;
  isLimitShare: boolean;
  linksCount: number;
  marketPrice: number;
  maskSeats: boolean;
  pdf: string;
  price: number;
  productionID: number;
  quantity: number;
  row: string;
  seatsRange: string;
  section: string;
  sourceTicketGroupID: number;
  startSeat: number;
  statusTypeId: number;
  stubHubListingId: number;
  ticketGroupID: number;
  userShNetworks: string;
  userShNetworksList: number[];
  ySShNetworks: string;
  ySShNetworksList: number[];
  ySTicketGroupShared: number;

  // From Block Data
  blockId?: number;
  blockName?: string;
  floor?: number;
  cmp1?: number;
  cmp2?: number;
  cmp3?: number;
  cmpList?: number;
  maxShare?: number;
  isDelete?: boolean;
  pricingRule?: PricingRule;

  // FE only
  listing: number;
  preparedCost: string;
  preparedMarketPrice: string;
  preparedFloor?: string;
  selected?: boolean;
  sortRank?: number;
  newPrice?: number = null;
  ticketGroupIds?: number[];

  public static getDataFromAPI(data: EventTicketGroupAPI): EventTicketGroup {
    return {
      barcodesCount: data.BarcodesCount,
      blockId: data.BlockID || null,
      companyID: data.CompanyID,
      cost: data.Cost,
      deliveryTypeId: data.DeliveryTypeId,
      documentsCount: data.DocumentsCount,
      endSeat: data.EndSeat,
      holdDateTimeUTC: data.HoldDateTimeUTC,
      holdExpirationDateTimeUTC: data.HoldExpirationDateTimeUTC,
      holdForClientID: data.HoldForClientID,
      inHandDate: data.InhandDate,
      isConsecutive: data.IsConsecutive,
      isDirtyMarketPrice: data.IsDirtyMarketPrice,
      isFullyMapped: data.IsFullyMapped,
      isGeneralAdmission: data.IsGeneralAdmission,
      isLimitShare: data.IsLimitShare,
      linksCount: data.LinksCount,
      marketPrice: data.MarketPrice,
      maskSeats: data.MaskSeats,
      pdf: data.Pdf,
      price: data.Price,
      productionID: data.ProductionID,
      quantity: data.Quantity,
      row: data.Row,
      seatsRange: data.SeatsRange,
      section: data.Section,
      sourceTicketGroupID: data.SourceTicketGroupID,
      startSeat: data.StartSeat,
      statusTypeId: data.StatusTypeId,
      stubHubListingId: data.StubhubListingId,
      ticketGroupID: data.TicketGroupID,
      userShNetworks: data.UserShNetworks,
      userShNetworksList: data.UserShNetworksList,
      ySShNetworks: data.YSShNetworks,
      ySShNetworksList: data.YSShNetworksList,
      ySTicketGroupShared: data.YSTicketGroupShared,

      // FE only:
      listing: null,
      preparedCost: trimZeroFromNumber(data.Cost),
      preparedMarketPrice: trimZeroFromNumber(data.MarketPrice),
    };
  }
}

export class EventTicketGroupAPI {
  BarcodesCount: number;
  BlockID?: number;
  CompanyID: number;
  Cost: number;
  DeliveryTypeId: number;
  DocumentsCount: number;
  EndSeat: number;
  HoldDateTimeUTC: string;
  HoldExpirationDateTimeUTC: string;
  HoldForClientID: number;
  InhandDate: string;
  IsConsecutive: boolean;
  IsDirtyMarketPrice: boolean;
  IsFullyMapped: boolean;
  IsGeneralAdmission: boolean;
  IsLimitShare: boolean;
  LinksCount: number;
  MarketPrice: number;
  MaskSeats: boolean;
  Pdf: string;
  Price: number;
  ProductionID: number;
  Quantity: number;
  Row: string;
  SortRank?: number;
  SeatsRange: string;
  Section: string;
  SourceTicketGroupID: number;
  StartSeat: number;
  StatusTypeId: number;
  StubhubListingId: number;
  TicketGroupID: number;
  UserShNetworks: string;
  UserShNetworksList: number[];
  YSShNetworks: string;
  YSShNetworksList: number[];
  YSTicketGroupShared: number;
}

export class TicketGroupNetworkTypes {
  public ticketGroupIDs: number[];
  public shared: number;
  public mask: number;
  public productionID: number;
}

export class TicketGroupNetworkTypesAPI {
  public TicketGroupIDs: number[];
  public Shared: number;
  public Mask: number;
  public ProductionID: number;
  public UiTimeZone: string;

  public static prepareDataForAPI(data: TicketGroupNetworkTypes): TicketGroupNetworkTypesAPI {
    return {
      TicketGroupIDs: data.ticketGroupIDs,
      Shared: data.shared,
      Mask: data.mask,
      ProductionID: data.productionID,
      UiTimeZone: getUserUILocaleTimeZone(),
    };
  }
}

export class TicketGroupPriceModelAPI {
  TicketGroupID: number;
  MarketPrice: number;
  ProductionID: number;

  public static prepareDataForAPI(data: EventTicketGroup): TicketGroupPriceModelAPI {
    return {
      ...new TicketGroupPriceModelAPI(),
      TicketGroupID: data.ticketGroupID,
      MarketPrice: data.marketPrice,
      ProductionID: data.productionID,
    };
  }
}
