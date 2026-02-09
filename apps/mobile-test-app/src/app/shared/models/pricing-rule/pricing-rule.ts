import { EventTicketGroup } from '@mobile-test-app/models/events/event-ticket-group';
import { PRICING_MODE_ID } from '@mobile-test-app/constants/pricing-mode/pricing-mode';

export class ComparablePrice {
  cmp1: number;
  cmp2: number;
  cmp3: number;
  cmpList: number;
}

export class PricingRule extends ComparablePrice {
  blockId: number;
  ceiling: number;
  cmpSeats: number;
  excludeRows: string[];
  excludeSections: string[];
  excludeStubHubSections: string[];
  floor: number;
  id: number;
  ignoreBelowFloorAmount: number; // in original uses in popup-pinch-zoom-mobile(block edit page)
  isAutoSplit: boolean = false;
  isCeilingEnabled: boolean;
  isCeilingReached: boolean;
  isFloorReached: boolean;
  isIgnoreBelowFloor: boolean;
  isMatchAllRows: boolean;
  isMatchAllSeats: boolean;
  isMktPercent: boolean;
  isNoComparables: boolean;
  isSpacingPercent: boolean;
  isUpdated: boolean;
  lastAdjUTC: Date;
  lastRanUTC: Date;
  matchRowRange1: string[];
  matchRowRange2: string[];
  matchRows: string;
  matchSeatGeekSections: string[];
  matchSections: string[];
  matchStubHubSections: string[];
  mktDiff: number;
  mktDiffAmount: number;
  mktDiffDisp: string;
  mktDiffPercent: number;
  pricingMode: PRICING_MODE_ID;
  spacing: number;
  spacingAmount: number;
  spacingDisp: string;
  spacingPercent: number;
  splitOption: number[];

  public static getDataFromAPI(data: PricingRuleAPI): PricingRule {
    return {
      ...new PricingRule(),
      ceiling: data.Ceiling,
      cmpSeats: data.CmpSeats,
      excludeRows: data.ExcludeRows,
      excludeSections: data.ExcludeSections,
      excludeStubHubSections: data.ExcludeStubhubSections,
      floor: data.Floor,
      id: data.Id,
      isAutoSplit: data.IsAutoSplit,
      isCeilingEnabled: data.IsCeilingEnabled,
      isFloorReached: data.IsFloorReached,
      isIgnoreBelowFloor: data.IsIgnoreBelowFloor,
      isMatchAllRows: data.IsMatchAllRows,
      isMatchAllSeats: data.IsMatchAllSeats,
      isNoComparables: data.IsNoComparables,
      lastAdjUTC: data.LastAdjUTC,
      lastRanUTC: data.LastRanUTC,
      matchRows: data.MatchRows,
      matchSeatGeekSections: data.MatchSeatGeekSections,
      matchSections: data.MatchSections,
      matchStubHubSections: data.MatchStubhubSections,
      mktDiffAmount: data.MktDiffAmount,
      mktDiffPercent: data.MktDiffPercent,
      pricingMode: data.PricingMode,
      spacingAmount: data.SpacingAmount,
      spacingPercent: data.SpacingPercent,
      splitOption: data.SplitOption,
    };
  }
}

export class PricingRuleAPI {
  Ceiling: number;
  Cmp: number;
  CmpList: number;
  CmpSeats: number;
  ExcludeRows: string[];
  ExcludeSections: string[];
  ExcludeStubhubSections: string[];
  Floor: number;
  Id: number;
  IsAutoSplit: boolean;
  IsCeilingEnabled: boolean;
  IsFloorReached: boolean;
  IsIgnoreBelowFloor: boolean;
  IsMatchAllRows: boolean;
  IsMatchAllSeats: boolean;
  IsNoComparables: boolean;
  LastAdjUTC: Date;
  LastRanUTC: Date;
  MatchRows: string;
  MatchSeatGeekSections: string[];
  MatchSections: string[];
  MatchStubhubSections: string[];
  MktDiffAmount: number;
  MktDiffPercent: number;
  PricingMode: PRICING_MODE_ID;
  SpacingAmount: number;
  SpacingPercent: number;
  SplitOption: number[];

  public static prepareDataFromEventTicketGroupForAPI(eventTicketGroup: EventTicketGroup): PricingRuleAPI {
    return {
      ...new PricingRuleAPI(),
      Floor: eventTicketGroup.floor,
    };
  }
}
