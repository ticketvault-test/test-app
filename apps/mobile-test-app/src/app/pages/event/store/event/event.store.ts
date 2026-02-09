import { tapResponse } from '@ngrx/operators';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { forkJoin, map, pipe, switchMap, tap } from 'rxjs';
import { signalStore, type, withMethods, withState } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { entityConfig, removeAllEntities, setAllEntities, updateEntities, withEntities } from '@ngrx/signals/entities';

import { initialEventState } from './event.state';
import { EVENT_STORE_ACTIONS } from '../constants/actions';
import { EventFiltersStore } from '../event-filters/event-filters.store';
import { withBaseStore } from '../../../../shared/models/store/base.store';
import { ComparablePrice } from '@mobile-test-app/models/pricing-rule/pricing-rule';
import { GlobalSpinner } from '@mobile-test-app/models/global-spinner/global-spinner';
import { EventsService } from '../../../../shared/services/events.service/events.service';
import { ExternalListing } from '@mobile-test-app/models/external-listing/external-listing';
import { EventForkJoinResult, EventTicketGroupsForkJoinResult } from '../models/event-fork-join-data';
import { trimZeroFromNumber } from '@mobile-test-app/helpers/format-number-helpers/format-number.helpers';
import { EventTicketGroup, TicketGroupNetworkTypes } from '../../../../shared/models/events/event-ticket-group';
import { GlobalSpinnerService } from '@mobile-test-app/services/global-spinner.service/global-spinner.service';
import { calculateComparablePrices, getMaxTicketGroupValue } from '@mobile-test-app/helpers/event-ticket-group-helpers/event-ticket-group.helpers';

const eventStoreFeatureKey = 'EventFeatureStore';
const eventTicketGroupConfig = entityConfig({
  entity: type<EventTicketGroup>(),
  selectId: (e) => e.ticketGroupID,
});

export const EventStore = signalStore(
  { providedIn: 'root' },
  withDevtools(eventStoreFeatureKey),
  withBaseStore(),
  withState(initialEventState),
  withEntities<EventTicketGroup>(eventTicketGroupConfig),

  withMethods((store) => {
    const eventsService = inject(EventsService);
    const globalSpinnerService = inject(GlobalSpinnerService);
    const eventFiltersStore = inject(EventFiltersStore);
    const maxValueForLastColumn = computed(() => getMaxTicketGroupValue(store.entities()));

    const clearStore = (): void => updateState(store, EVENT_STORE_ACTIONS.clearStore, initialEventState, removeAllEntities());

    const getEvent = rxMethod<void>(
      pipe(
        tap((): void => {
          globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), message: 'Loading...', loading: true });
          updateState(store, EVENT_STORE_ACTIONS.getEventData, { pending: true });
        }),
        switchMap(() =>
          forkJoin({
            getEvents: eventsService.getEvents$(eventFiltersStore.filters()),
            getEventInfo: eventsService.getEventInfo$(eventFiltersStore.productionId()),
          })
            .pipe(
              tapResponse({
                next: (res: EventForkJoinResult): void => {
                  globalSpinnerService.setGlobalSpinnerState({
                    ...globalSpinnerService.globalSpinnerState(), loading: store.eventTicketGroupsWithListingsPending() ? true : false }); // todo find good solution when global spinner starts handle his state
                  updateState(
                    store,
                    EVENT_STORE_ACTIONS.getEventDataSuccess,
                    (state) => ({
                      ...state,
                      eventItem: {
                        ...res.getEvents[0],
                        tmEventId: res.getEventInfo.tmEventId,
                        vividEventId: res.getEventInfo.vividEventId,
                        seatGeekEventId: res.getEventInfo.seatGeekEventId,
                        stubHubEventID: res.getEventInfo.stubHubEventID,
                      },
                      pending: false,
                    }),
                  );
                },
                error: (error: never): void => {
                  globalSpinnerService.setGlobalSpinnerState({
                    ...globalSpinnerService.globalSpinnerState(), loading: store.eventTicketGroupsWithListingsPending() ? true : false });
                  updateState(store, EVENT_STORE_ACTIONS.getEventDataFailure, { error, pending: false });
                },
              }),
            ),
        ),
      ),
    );

    const getEventTicketGroupsWithListings = rxMethod<void>(
      pipe(
        tap((): void => {
          globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), message: 'Loading...', loading: true });
          updateState(store, EVENT_STORE_ACTIONS.getEventTicketGroups, {
            eventTicketGroupsWithListingsPending: true,
          });
        }),
        switchMap(() =>
          forkJoin({
            ticketGroupsResponse: eventsService.getEventTicketGroupsResponse$(eventFiltersStore.productionId()),
            externalListingsResponse: eventsService.getEventExternalListings$(eventFiltersStore.productionId()),
          }).pipe(
            map(({ ticketGroupsResponse, externalListingsResponse }) => {
              const externalListings: ExternalListing[] = externalListingsResponse?.listings ?? [];
              const comparablePricesCache: { [key: number]: ComparablePrice } = {};

              const ticketGroups: EventTicketGroup[] = ticketGroupsResponse.reduce((acc, cur) => {
                let comparablePrices: ComparablePrice = new ComparablePrice();

                if (cur.pricingRule?.id) {
                  if (comparablePricesCache[cur.pricingRule.id]) {
                    comparablePrices = comparablePricesCache[cur.pricingRule.id];
                  } else {
                    comparablePrices = calculateComparablePrices(externalListings, cur.pricingRule);
                    comparablePricesCache[cur.pricingRule.id] = comparablePrices;
                  }
                }

                const ticketGroupsWithComp = cur.ticketGroups.map(ticketGroup => ({
                  ...ticketGroup,
                  cmp1: comparablePrices.cmp1 ?? ticketGroup.cmp1,
                  cmp2: comparablePrices.cmp2 ?? ticketGroup.cmp2,
                  cmp3: comparablePrices.cmp3 ?? ticketGroup.cmp3,
                  cmpList: comparablePrices.cmpList ?? ticketGroup.cmpList,
                }));

                return [...acc, ...ticketGroupsWithComp];
              }, []);

              return {
                ticketGroups,
                externalListings,
              };
            }),
            tapResponse({
              next: (res: EventTicketGroupsForkJoinResult): void => {
                updateState(
                  store,
                  EVENT_STORE_ACTIONS.getEventTicketGroupsSuccess,
                  (state) => {
                    const next = setAllEntities(res.ticketGroups, eventTicketGroupConfig)(state);

                    return {
                      ...next,
                      externalEventListings: res.externalListings,
                      eventTicketGroupsWithListingsPending: false,
                    };
                  },
                );
                globalSpinnerService.setGlobalSpinnerState({ ...globalSpinnerService.globalSpinnerState(), loading: store.pending() ? true : false });
              },
              error: (error: never): void => {
                updateState(store, EVENT_STORE_ACTIONS.getEventTicketGroupsFailure, {
                  error,
                  eventTicketGroupsWithListingsPending: false,
                });
                globalSpinnerService.setGlobalSpinnerState({ ...globalSpinnerService.globalSpinnerState(), loading: store.pending() ? true : false });
              },
            }),
          ),
        ),
      ),
    );

    const updateNetworksBroadcast = rxMethod<TicketGroupNetworkTypes>(
      pipe(
        tap((): void => {
          globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), message: 'Loading...', loading: true });
          updateState(store, EVENT_STORE_ACTIONS.updateNetworksBroadcast, { pending: true });
        }),
        switchMap((data: TicketGroupNetworkTypes) =>
          eventsService.saveNetworksBroadcast$(data)
            .pipe(
              tapResponse({
                next: (eventTicketGroups: EventTicketGroup[]): void => {
                  globalSpinnerService.setGlobalSpinnerState({ ...globalSpinnerService.globalSpinnerState(), loading: false });
                  updateState(
                    store,
                    EVENT_STORE_ACTIONS.updateNetworksBroadcastSuccess,
                    (state) => {
                      const next = updateEntities({
                        predicate: (entity: EventTicketGroup) =>
                          eventTicketGroups.some(e => e.ticketGroupID === entity.ticketGroupID),
                        changes: (entity: EventTicketGroup) => {
                          const changedEventTicketGroup = eventTicketGroups.find(e => e.ticketGroupID === entity.ticketGroupID);
                          const blockTicketGroupIds = entity.ticketGroupIds || [];
                          const listing = blockTicketGroupIds.filter(tgId => {
                            const group = eventTicketGroups.find(e => e.ticketGroupID === tgId);

                            return group && group.userShNetworksList.length;
                          }).length;
                          return {
                            ...entity,
                            userShNetworks: changedEventTicketGroup.userShNetworks,
                            userShNetworksList: changedEventTicketGroup.userShNetworksList,
                            listing,
                          };
                        },
                      }, eventTicketGroupConfig)(state);

                      return { ...next, pending: false };
                    },
                  );
                },
                error: (error: never): void => {
                  globalSpinnerService.setGlobalSpinnerState({ ...globalSpinnerService.globalSpinnerState(), loading: false });
                  updateState(store, EVENT_STORE_ACTIONS.updateNetworksBroadcastFailure, { error, pending: false });
                },
              }),
            ),
        ),
      ),
    );

    const updateBulkPrice = rxMethod<EventTicketGroup[]>(
      pipe(
        tap((): void => {
          globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), message: 'Loading...', loading: true });
          updateState(store, EVENT_STORE_ACTIONS.updateBulkPrice, { pending: true });
        }),
        switchMap((data: EventTicketGroup[]) =>
          eventsService.saveBulkPrice$(data)
            .pipe(
              tapResponse({
                next: (eventTicketGroups: EventTicketGroup[]): void => {
                  globalSpinnerService.setGlobalSpinnerState({ ...globalSpinnerService.globalSpinnerState(), loading: false });
                  updateState(
                    store,
                    EVENT_STORE_ACTIONS.updateBulkPriceSuccess,
                    (state) => {
                      const next = updateEntities({
                        predicate: (entity: EventTicketGroup) =>
                          eventTicketGroups.some(e => e.ticketGroupID === entity.ticketGroupID),
                        changes: (entity: EventTicketGroup) => {
                          const updated = eventTicketGroups.find(e => e.ticketGroupID === entity.ticketGroupID);

                          return updated ? {
                            ...entity,
                            marketPrice: updated.marketPrice,
                            preparedMarketPrice: trimZeroFromNumber(updated.marketPrice),
                            isDirtyMarketPrice: updated.isDirtyMarketPrice,
                          } : entity;
                        },
                      }, eventTicketGroupConfig)(state);

                      return { ...next, pending: false };
                    },
                  );
                },
                error: (error: never): void => {
                  globalSpinnerService.setGlobalSpinnerState({ ...globalSpinnerService.globalSpinnerState(), loading: false });
                  updateState(store, EVENT_STORE_ACTIONS.updateBulkPriceFailure, { error, pending: false });
                },
              }),
            ),
        ),
      ),
    );

    const updateBlocks = rxMethod<EventTicketGroup[]>(
      pipe(
        tap((): void => {
          globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), message: 'Loading...', loading: true });
          updateState(store, EVENT_STORE_ACTIONS.updateBlocks, { pending: true });
        }),
        switchMap((data: EventTicketGroup[]) =>
          eventsService.updateBlock$(eventFiltersStore.productionId(), data)
            .pipe(
              tapResponse({
                next: (eventTicketGroups: EventTicketGroup[]): void => {
                  globalSpinnerService.setGlobalSpinnerState({ ...globalSpinnerService.globalSpinnerState(), loading: false });
                  updateState(
                    store,
                    EVENT_STORE_ACTIONS.updateBlocksSuccess,
                    (state) => {
                      const next = updateEntities({
                        predicate: (entity: EventTicketGroup) =>
                          eventTicketGroups.some(e => e.ticketGroupID === entity.ticketGroupID),
                        changes: (entity: EventTicketGroup) => {
                          const updated = eventTicketGroups.find(e => e.ticketGroupID === entity.ticketGroupID);

                          return updated ? {
                            ...entity,
                            blockId: updated.blockId,
                            floor: updated.floor,
                            preparedFloor: trimZeroFromNumber(updated.floor),
                            isDelete: updated.isDelete,
                            isDirtyMarketPrice: updated.isDirtyMarketPrice,
                          } : entity;
                        },
                      }, eventTicketGroupConfig)(state);

                      return { ...next, pending: false };
                    },
                  );
                },
                error: (error: never): void => {
                  globalSpinnerService.setGlobalSpinnerState({ ...globalSpinnerService.globalSpinnerState(), loading: false });
                  updateState(store, EVENT_STORE_ACTIONS.updateBlocksFailure, { error, pending: false });
                },
              }),
            ),
        ),
      ),
    );

    const getEventPageData = (): void => {
      getEvent();
      getEventTicketGroupsWithListings();
    };

    return {
      getEvent,
      clearStore,
      updateBlocks,
      updateBulkPrice,
      getEventPageData,
      maxValueForLastColumn,
      updateNetworksBroadcast,
      getEventTicketGroupsWithListings,
    };
  }),
);
