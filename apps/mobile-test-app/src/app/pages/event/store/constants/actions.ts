export const EVENT_STORE_ACTIONS = {
  clearStore: '[Event] Clear Store',

  getEventData: '[API/Event] Get Event Data',
  getEventDataSuccess: '[API/Event] Get Event Data Success',
  getEventDataFailure: '[API/Event] Get Event Data Failure',

  getEventExternalListings: '[API/Event] Get Event External Listings',
  getEventExternalListingsSuccess: '[API/Event] Get Event External Listings Success',
  getEventExternalListingsFailure: '[API/Event] Get Event External Listings Failure',

  getEventTicketGroups: '[API/Event] Get Event Ticket Groups',
  getEventTicketGroupsSuccess: '[API/Event] Get Event Ticket Groups Success',
  getEventTicketGroupsFailure: '[API/Event] Get Event Ticket Groups Failure',

  getEventTicketGroupsWithListings: '[API/Event] Get Event Ticket Groups With Listings',
  getEventTicketGroupsWithListingsSuccess: '[API/Event] Get Event Ticket Groups With Listings Success',
  getEventTicketGroupsWithListingsFailure: '[API/Event] Get Event Ticket Groups With Listings Failure',

  updateNetworksBroadcast: '[API/Event] Update Network Broadcast',
  updateNetworksBroadcastSuccess: '[API/Event] Update Network Broadcast Success',
  updateNetworksBroadcastFailure: '[API/Event] Update Network Broadcast Failure',

  updateBulkPrice: '[API/Event] Update Bulk Price',
  updateBulkPriceSuccess: '[API/Event] Update Bulk Price Success',
  updateBulkPriceFailure: '[API/Event] Update Bulk Price Failure',

  updateBlocks: '[API/Event] Update Blocks',
  updateBlocksSuccess: '[API/Event] Update Blocks Success',
  updateBlocksFailure: '[API/Event] Update Blocks Failure',
};

export const EVENT_FILTERS_STORE_ACTIONS = {
  clearStore: '[Event Filters] Clear Store',

  setFilters: '[Event Filters] Set Event Item Filters',
};
