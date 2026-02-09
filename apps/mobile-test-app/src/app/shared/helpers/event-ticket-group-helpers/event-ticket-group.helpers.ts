import { EventTicketGroup } from '@mobile-test-app/models/events/event-ticket-group';
import { PRICING_MODE_ID } from '@mobile-test-app/constants/pricing-mode/pricing-mode';
import { ExternalListing } from '@mobile-test-app/models/external-listing/external-listing';
import { ComparablePrice, PricingRule, PricingRuleAPI } from '@mobile-test-app/models/pricing-rule/pricing-rule';

export function fillPrice(ticketGroups: EventTicketGroup[], pricingRule: PricingRule): EventTicketGroup[] {
  if (!pricingRule || !pricingRule.cmp1 || !pricingRule.mktDiff) {
    ticketGroups.forEach(group => { group.newPrice = null; });
    return ticketGroups;
  }

  ticketGroups.sort((a, b) => {
    if (a.sortRank && b.sortRank) {
      return a.sortRank - b.sortRank;
    }
    return 0;
  });

  const spacing = pricingRule.spacing ?? 0;

  for (let i = 0; i < ticketGroups.length; i++) {
    let newPrice: number;

    if (i === 0) {
      newPrice = pricingRule.isMktPercent
        ? pricingRule.cmp1 + (pricingRule.mktDiff * pricingRule.cmp1) / 100
        : pricingRule.cmp1 + pricingRule.mktDiff;

      pricingRule.isFloorReached = pricingRule.floor ? newPrice <= pricingRule.floor : false;

      if (pricingRule.ceiling != null && newPrice > pricingRule.ceiling) {
        newPrice = pricingRule.ceiling;
        pricingRule.isCeilingReached = true;
      } else {
        pricingRule.isCeilingReached = false;
      }
    } else {
      const prevPrice = ticketGroups[i - 1].newPrice ?? 0;
      newPrice = pricingRule.isSpacingPercent
        ? prevPrice + (spacing * prevPrice) / 100
        : prevPrice + spacing;
    }

    ticketGroups[i].newPrice = pricingRule.floor != null
      ? (newPrice > pricingRule.floor ? newPrice : pricingRule.floor)
      : newPrice;
  }

  return ticketGroups;
}

export function fillMatchRows(pricingRule: PricingRule, pricingRuleAPI: PricingRuleAPI | null): void {
  pricingRule.matchRowRange1 = [];
  pricingRule.matchRowRange2 = [];

  if (!pricingRuleAPI || !pricingRuleAPI.MatchRows) {
    pricingRule.matchRowRange1 = ['', ''];
    pricingRule.matchRowRange2 = ['', ''];

    return;
  }

  const rows = JSON.parse(pricingRuleAPI.MatchRows);
  if (!(rows instanceof Array) || rows.length !== 2) {
    pricingRule.matchRowRange1 = ['', ''];
    pricingRule.matchRowRange2 = ['', ''];

    return;
  }

  pricingRule.matchRowRange1 = rows[0];
  pricingRule.matchRowRange2 = rows[1];
}

export function calculateComparablePrices(listings: ExternalListing[], pricingRule: PricingRule): ComparablePrice {
  if (!listings?.length || !pricingRule) {
    return new ComparablePrice();
  }

  const isStubHubMode = pricingRule.pricingMode === PRICING_MODE_ID.tVData ||
    (pricingRule.pricingMode === PRICING_MODE_ID.seatGeek && pricingRule.matchStubHubSections?.length > 0);

  const selectedSections = isStubHubMode
    ? pricingRule.matchStubHubSections
    : pricingRule.matchSeatGeekSections;

  if (!selectedSections?.length) {
    return new ComparablePrice();
  }

  const [row1Low = '', row1High = ''] = pricingRule.matchRowRange1 || [];
  const [row2Low = '', row2High = ''] = pricingRule.matchRowRange2 || [];

  let filteredListings = listings.filter((listing) => {
    const sectionIds = getListingSectionIds(listing, isStubHubMode);

    if (!sectionIds.length || !isValidNetwork(listing, pricingRule)) return false;

    const sectionOk = checkSelectedSections(selectedSections, sectionIds);
    const splitOk = hasSplitIntersection(listing, pricingRule);

    const rowOk = pricingRule.isMatchAllRows
      || rowIsIncluded(row1Low, row1High, listing.row)
      || rowIsIncluded(row2Low, row2High, listing.row);

    if (pricingRule.isMatchAllSeats) return splitOk;

    return sectionOk && splitOk && rowOk;
  });

  filteredListings = filteredListings.map((listing: ExternalListing) => isIgnore(listing, pricingRule) ? { ...listing, isIgnore: true } : listing);

  const notIgnoredListings = filteredListings.filter((listing: ExternalListing) => !listing.isIgnore);

  notIgnoredListings.sort((a, b) => a.price - b.price);

  const firstThree = notIgnoredListings.slice(0, 3);

  return {
    cmp1: firstThree[0]?.price ?? null,
    cmp2: firstThree[1]?.price ?? null,
    cmp3: firstThree[2]?.price ?? null,
    cmpList: notIgnoredListings.length,
  };
}

export function getMaxTicketGroupValue(ticketGroups: EventTicketGroup[]): number {
  return Math.max(...ticketGroups.flatMap(eventTicketGroup => [
    eventTicketGroup.cost ?? 0,
    eventTicketGroup.marketPrice ?? 0,
    eventTicketGroup.listing ?? 0,
  ])).toString().length;
}

function rowIsIncluded(low: string | null, high: string | null, rowValue: string): boolean {
  if (!rowValue || (!low && !high)) return false;

  if (low && high) {
    return rowValue.localeCompare(low, undefined, { numeric: true }) >= 0
      && rowValue.localeCompare(high, undefined, { numeric: true }) <= 0;
  }
  if (low) {
    return rowValue.localeCompare(low, undefined, { numeric: true }) >= 0;
  }
  if (high) {
    return rowValue.localeCompare(high, undefined, { numeric: true }) <= 0;
  }

  return false;
}

function getListingSectionIds(listing: ExternalListing, isStubHubMode: boolean): string[] {
  return isStubHubMode ? listing.stubHubSectionIds : [listing.sectionId];
}

function isIgnore(listing: ExternalListing, pricingRule: PricingRule): boolean {
  return pricingRule.isIgnoreBelowFloor
    && pricingRule.ignoreBelowFloorAmount != null
    && pricingRule.floor != null
    && listing.price < pricingRule.floor - pricingRule.ignoreBelowFloorAmount;
}

function isValidNetwork(listing: ExternalListing, pricingRule: PricingRule): boolean {
  return (pricingRule.pricingMode === PRICING_MODE_ID.seatGeek && listing.seatGeekEventId > 0)
    || (pricingRule.pricingMode === PRICING_MODE_ID.tVData && listing.stubHubEventId > 0);
}

function hasSplitIntersection(listing: ExternalListing, pricingRule: PricingRule): boolean {
  if (!pricingRule.splitOption?.length) return true;

  if (!listing.splitVector || !listing.splitVector.length) return false;

  return listing.splitVector.some(v => pricingRule.splitOption.includes(v));
}

function checkSelectedSections(selectedSections: string[], sectionIds: string[]): boolean {
  return selectedSections.some(section => sectionIds.map(id => id?.toString()).includes(section));
}

