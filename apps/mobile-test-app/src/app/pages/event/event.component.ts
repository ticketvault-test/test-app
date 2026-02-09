import { addIcons } from 'ionicons';
import type { ModalOptions } from '@ionic/core';
import { ActivatedRoute, Params } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, ViewEncapsulation, OnDestroy, signal, computed, untracked } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonIcon, IonPopover, IonCheckbox, IonList, IonItem, NavController, ModalController } from '@ionic/angular/standalone';
import { arrowBackOutline, chevronDownCircleOutline, informationCircle, location, refreshCircleOutline, time, chevronForwardOutline, pencilOutline, headsetOutline, settingsOutline, funnelOutline, eye, cubeOutline, listOutline } from 'ionicons/icons';

import { EventStore } from './store/event/event.store';
import { PAGE_URL } from '@mobile-test-app/constants/pages/pages';
import { EventsFilters } from '@mobile-test-app/models/events/events';
import { EventFiltersStore } from './store/event-filters/event-filters.store';
import { QUERY_PARAMS_KEYS } from '../../shared/constants/query-params/query-params';
import { BlockTableComponent } from './components/block-table/block-table.component';
import { MarketTableComponent } from './components/market-table/market-table.component';
import { NetworkTypeModel } from '@mobile-test-app/models/network-type-model/network-type-model';
import { EventInfoHeaderComponent } from './components/event-info-header/event-info-header.component';
import { EventTicketGroup, TicketGroupNetworkTypes } from '../../shared/models/events/event-ticket-group';
import { EditPriceModalComponent } from './components/modals/edit-price-modal/edit-price-modal.component';
import { EditFloorsModalComponent } from './components/modals/edit-floors-modal/edit-floors-modal.component';
import { TicketNetworkTypeStateType } from '@mobile-test-app/constants/ticket-network-type/network-state';
import { ConfirmModalService } from '@mobile-test-app/services/confirm-modal.service/confirm-modal.service';
import { FilterByFieldTruthyOrFalsyPipe } from '../../shared/pipes/filter-array-by-field/filter-array-by-field.pipe';
import { EditBroadcastModalComponent } from './components/modals/edit-broadcast-modal/edit-broadcast-modal.component';
import { UnblockedListingTableComponent } from './components/unblocked-listing-table/unblock-listing-table.component';
import { calculateNetworkMask, calculateSharedNetworks, createNetworkStatus } from '@mobile-test-app/helpers/network-status-helpers/network-status.helpers';
import { getNotificationSelectAtLeastOneBlock, getNotificationSelectAtLeastOneBlockToUnlock, getNotificationSelectAtLeastOneListing } from '@mobile-test-app/constants/confirm-modal/confirm-modal';

@Component({
  standalone: true,
  selector: 'event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonIcon,
    IonList,
    IonItem,
    IonHeader,
    IonButton,
    IonContent,
    IonPopover,
    IonCheckbox,
    BlockTableComponent,
    EventInfoHeaderComponent,
    UnblockedListingTableComponent,
    FilterByFieldTruthyOrFalsyPipe,
  ],
})
export class EventComponent implements OnInit, OnDestroy {
  public readonly navController = inject(NavController);
  public readonly eventStore = inject(EventStore);
  public readonly modalController = inject(ModalController);
  public readonly confirmModalService = inject(ConfirmModalService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly eventFiltersStore = inject(EventFiltersStore);

  public eventGroupListings = signal<EventTicketGroup[]>([]);
  public isEventFilterMenuOpen = signal<boolean>(false);

  public allBlocksSelected = computed<boolean>(() => {
    const blockedListings = this.eventGroupListings().filter(listing => listing.blockId);

    if (!blockedListings.length) return false;

    return blockedListings.every(listing => listing.selected);
  });

  public allUnblockedSelected = computed<boolean>(() => {
    const unblockedListings = this.eventGroupListings().filter(listing => !listing.blockId);

    if (!unblockedListings.length) return false;

    return unblockedListings.every(listing => listing.selected);
  });

  public allSelected = computed<boolean>(() => {
    if (!this.eventGroupListings().length) return false;

    return !!this.eventGroupListings().length && this.eventGroupListings().every(b => b.selected);
  });

  protected readonly MAX_SYMBOL_WIDTH_COLUMN = 11;
  protected readonly PAGE_URL = PAGE_URL;

  constructor() {
    addIcons({
      eye,
      time,
      location,
      cubeOutline,
      listOutline,
      pencilOutline,
      funnelOutline,
      headsetOutline,
      settingsOutline,
      arrowBackOutline,
      informationCircle,
      refreshCircleOutline,
      chevronForwardOutline,
      chevronDownCircleOutline,
    });

    effect(() => this.eventStore.entities() && untracked(() => this.eventGroupListings.set(this.eventStore.entities())));
  }

  public ngOnInit(): void {
    this.getEventId();
  }

  public ngOnDestroy(): void {
    this.eventStore.clearStore();
  }

  public toggleAllItems(isChecked: boolean): void {
    this.eventGroupListings.update(listings => listings.map(eventTicketGroup => ({ ...eventTicketGroup, selected: isChecked })));
  }

  public selectionChange(data: { id: number; checked: boolean }): void {
    this.eventGroupListings.update(listings =>
      listings.map(listing =>
        listing.ticketGroupID === data.id ? { ...listing, selected: data.checked } : listing,
      ),
    );
  }

  public toggleAllUnblockedSelection(selected: boolean): void {
    this.eventGroupListings.update(listings => listings.map(eventTicketGroup =>
      ({ ...eventTicketGroup, selected: !eventTicketGroup.blockId ? selected : eventTicketGroup.selected })));
  }

  public toggleAllBlockedSelection(selected: boolean): void {
    this.eventGroupListings.update(listings => listings.map(eventTicketGroup =>
      ({ ...eventTicketGroup, selected: eventTicketGroup.blockId ? selected : eventTicketGroup.selected })));
  }

  public async editBroadcast(eventTicketGroup: EventTicketGroup[]): Promise<void> {
    const modal = await this.modalController.create(this.prepareEditEditBroadcastModalComponent(eventTicketGroup));

    await modal.present();

    const result = await modal.onDidDismiss();

    if (!result.data) return;

    const changedNetworkTypes: NetworkTypeModel[] = result.data;
    const initialSelectedIds = (eventTicketGroup[0]?.userShNetworksList ?? []).sort();
    const currentSelectedIds = changedNetworkTypes.filter(nt => nt.isChecked).map(nt => nt.id).sort();
    const isChanged = JSON.stringify(initialSelectedIds) !== JSON.stringify(currentSelectedIds);

    if (!isChanged) return;

    this.saveBroadcastChange(changedNetworkTypes);
  }

  public async openMarketTable(): Promise<void> {
    const modal = await this.modalController.create(this.prepareMarketTableModalComponent());

    await modal.present();
  }

  public async editAdjustFloors(eventTicketGroups: EventTicketGroup[]): Promise<void> {
    const modal = await this.modalController.create(this.prepareEditFloorsModalComponent(eventTicketGroups));

    await modal.present();

    const result = await modal.onDidDismiss();

    if (!result.data) return;

    this.updateBlocks(result.data);
  }

  public async editAdjustPrice(eventTicketGroups: EventTicketGroup[]): Promise<void> {
    const modal = await this.modalController.create(this.prepareEditPriceModalComponent(eventTicketGroups));

    await modal.present();

    const result = await modal.onDidDismiss();

    if (!result.data) return;

    this.eventStore.updateBulkPrice(result.data);
  }

  public navigateToBlockDetails(block: EventTicketGroup): void {
    // this.navController.navigateForward([`${PAGE_URL.event}/${this.eventFiltersStore.eventId()}/block/${block.ticketGroupID}`]);
  }

  private saveBroadcastChange(networkTypes: NetworkTypeModel[]): void {
    const selectedTicketGroupIds = this.eventGroupListings()
      .filter(listing => listing.selected)
      .map(listing => listing.blockId ? listing.ticketGroupIds : listing.ticketGroupID).flat();
    const networkStatuses = networkTypes.map(networkType => createNetworkStatus(networkType.id, networkType.isChecked));
    const usedNetworkStatuses = networkStatuses.filter(status => status.state !== TicketNetworkTypeStateType.Unknown);
    const shared = calculateSharedNetworks(usedNetworkStatuses);
    const mask = calculateNetworkMask(networkStatuses, usedNetworkStatuses);

    this.eventStore.updateNetworksBroadcast({
      ...new TicketGroupNetworkTypes(),
      ticketGroupIDs: selectedTicketGroupIds,
      productionID: this.eventFiltersStore.eventId(),
      shared,
      mask,
    });
  }

  public async openAdjustPricingRules(): Promise<void> {
    this.isEventFilterMenuOpen.set(false);

    const selectedListings = this.eventGroupListings().filter(it => it.blockId && it.selected);

    if (!selectedListings.length) {
      await this.confirmModalService.openConfirmModal(getNotificationSelectAtLeastOneBlock());

      return;
    }

    await this.editAdjustFloors(selectedListings);
  }

  public async unblockListings(): Promise<void> {
    this.isEventFilterMenuOpen.set(false);

    const selectedListings = this.eventGroupListings().filter(it => it.blockId && it.selected);

    if (!selectedListings.length) {
      await this.confirmModalService.openConfirmModal(getNotificationSelectAtLeastOneBlockToUnlock());

      return;
    }

    this.updateBlocks(selectedListings.map(listing => ({ ...new EventTicketGroup(), blockId: listing.blockId, isDelete: true })));
  }

  public async openBroadcastEdit(): Promise<void> {
    this.isEventFilterMenuOpen.set(false);

    const selectedListings = this.eventGroupListings().filter(it => it.selected);

    if (!selectedListings.length) {
      await this.confirmModalService.openConfirmModal(getNotificationSelectAtLeastOneListing());

      return;
    }

    await this.editBroadcast(selectedListings);
  }

  private getEventId(): void {
    this.activatedRoute.queryParams
      .pipe(
        map((params: Params) => this.prepareEventItemFilters(params, +this.activatedRoute.snapshot.params[QUERY_PARAMS_KEYS.eventId])),
        filter((filters: EventsFilters) => !!filters.productionId),
        distinctUntilChanged(),
      )
      .subscribe((filters: EventsFilters) => {
        this.eventFiltersStore.setEventItemFilters(filters);
        this.eventStore.getEventPageData();
      });
  }

  private prepareEditFloorsModalComponent(eventTicketGroups?: EventTicketGroup[]): ModalOptions {
    return {
      component: EditFloorsModalComponent,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      cssClass: 'custom-modal-auto-height',
      handle: false,
      componentProps: { eventTicketGroups },
    };
  }

  private prepareEditPriceModalComponent(eventTicketGroups?: EventTicketGroup[]): ModalOptions {
    return {
      component: EditPriceModalComponent,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      cssClass: 'custom-modal-auto-height',
      handle: false,
      componentProps: { eventTicketGroups },
    };
  }

  private prepareEditEditBroadcastModalComponent(eventTicketGroup: EventTicketGroup[]): ModalOptions {
    return {
      component: EditBroadcastModalComponent,
      cssClass: 'custom-modal',
      componentProps: { eventTicketGroup },
    };
  }

  private prepareMarketTableModalComponent(): ModalOptions {
    return {
      component: MarketTableComponent,
      cssClass: 'market-view-side-menu',
      backdropDismiss: true,
      componentProps: { externalEventListings: this.eventStore.externalEventListings() },
    };
  }

  private updateBlocks(eventTicketGroup: EventTicketGroup[]): void {
    this.eventStore.updateBlocks(eventTicketGroup);
  }

  private prepareEventItemFilters(params: Params, eventId: number): EventsFilters {
    return {
      ...new EventsFilters(),
      productionId: eventId,
      includeAvailable: params[QUERY_PARAMS_KEYS.includeAvailable],
      includeExpired: params[QUERY_PARAMS_KEYS.includeExpired],
      includeParking: params[QUERY_PARAMS_KEYS.includeParking],
      includeRegular: params[QUERY_PARAMS_KEYS.includeRegular],
      includeSold: params[QUERY_PARAMS_KEYS.includeSold],
      includeSoldInfo: params[QUERY_PARAMS_KEYS.includeSoldInfo],
    };
  }
}
