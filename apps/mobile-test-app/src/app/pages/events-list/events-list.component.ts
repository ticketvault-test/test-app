import { addIcons } from 'ionicons';
import { Params } from '@angular/router';
import { KeyValuePipe } from '@angular/common';
import type { ModalOptions } from '@ionic/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavController, RefresherCustomEvent } from '@ionic/angular';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { chevronDownCircleOutline, optionsOutline, refreshCircleOutline, syncOutline, logOutOutline } from 'ionicons/icons';
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, ModalController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation, QueryList, ViewChildren, ElementRef, OnDestroy, effect, viewChild, signal, ChangeDetectorRef } from '@angular/core';

import { EventsFilters } from '../../shared/models/events/events';
import { EventsListStore } from './store/events-list/events-list.store';
import { PAGE_NAME, PAGE_URL } from '../../shared/constants/pages/pages';
import { EVENT_TABS_FILTERS_BROADCAST } from './constants/event-tabs-filters';
import { trackBy } from '@mobile-test-app/helpers/track-by/track-by.helper';
import { PLATFORM_MODE } from '../../shared/constants/platform-mode/platform-mode';
import { EventsFiltersStore } from './store/events-list-filters/events-list-filter.store';
import { LogoutService } from '@mobile-test-app/services/logout.service/logout.service';
import { QUERY_PARAMS_KEYS } from '@mobile-test-app/constants/query-params/query-params';
import { EventsListCardComponent } from './components/events-list-card/events-list-card.component';
import { EventsListFiltersComponent } from './components/events-list-filters/events-list-filters.component';

@Component({
  standalone: true,
  selector: 'events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonHeader,
    IonContent,
    IonSegment,
    FormsModule,
    KeyValuePipe,
    IonRefresher,
    ScrollingModule,
    IonSegmentButton,
    IonRefresherContent,
    ReactiveFormsModule,
    EventsListCardComponent,
    CdkVirtualScrollViewport,
  ],
})
export class EventsListComponent implements OnInit, OnDestroy {
  public readonly navController = inject(NavController);
  public readonly eventsStore = inject(EventsListStore);
  public readonly eventsFiltersStore = inject(EventsFiltersStore);
  public readonly logoutService = inject(LogoutService);
  private readonly modalController = inject(ModalController);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  public viewportRef = viewChild<CdkVirtualScrollViewport>('viewport');

  @ViewChildren('eventItem', { read: ElementRef }) eventItems!: QueryList<ElementRef>;

  public canRefresh = signal<boolean>(true);

  public readonly trackBy = trackBy;

  protected readonly location = location;
  protected readonly PAGE_URL = PAGE_URL;
  protected readonly ITEM_HEIGHT = 195;
  protected readonly PAGE_NAME = PAGE_NAME;
  protected readonly PLATFORM_MODE = PLATFORM_MODE;
  protected readonly EVENT_TABS_FILTERS_BROADCAST = EVENT_TABS_FILTERS_BROADCAST;

  private refresherEvent: RefresherCustomEvent | null = null;

  constructor() {
    addIcons({ refreshCircleOutline, optionsOutline, chevronDownCircleOutline, syncOutline, logOutOutline });

    effect(() => {
      const isPending = this.eventsStore.pending();

      if (!isPending && this.refresherEvent) {
        this.refresherEvent.target.complete();
        this.refresherEvent = null;
      }
    });
  }

  public ngOnInit(): void {
    this.getEventsData();
  }

  public ngOnDestroy(): void {
    this.eventsStore.clearStore();
  }

  public onScroll(): void {
    const viewportElement = this.viewportRef();

    if (viewportElement) {
      const scrollOffset = viewportElement.measureScrollOffset('top');
      const isAtTop = scrollOffset === 0; // do not refresh if scroll not in the top of list

      if (this.canRefresh() !== isAtTop) {
        this.canRefresh.set(isAtTop);

        this.changeDetectorRef.markForCheck();
      }
    }
  }

  public setQueryParams(): Params {
    return {
      [QUERY_PARAMS_KEYS.includeAvailable]: this.eventsFiltersStore.filters().includeAvailable,
      [QUERY_PARAMS_KEYS.includeExpired]: this.eventsFiltersStore.filters().includeExpired,
      [QUERY_PARAMS_KEYS.includeParking]: this.eventsFiltersStore.filters().includeParking,
      [QUERY_PARAMS_KEYS.includeRegular]: this.eventsFiltersStore.filters().includeRegular,
      [QUERY_PARAMS_KEYS.includeSold]: this.eventsFiltersStore.filters().includeSold,
      [QUERY_PARAMS_KEYS.includeSoldInfo]: this.eventsFiltersStore.filters().includeSoldInfo,
    };
  }

  public doRefresh(event: RefresherCustomEvent): void {
    this.refresherEvent = event;
    this.getEventsData();
  }

  public changeBroadCast(selected: CustomEvent): void {
    switch (selected.detail.value) {
      case EVENT_TABS_FILTERS_BROADCAST.allEvents: {
        this.setFilter('includeBroadcasted', null);
        this.setFilter('includeUnbroadcasted', null);

        break;
      }
      case EVENT_TABS_FILTERS_BROADCAST.includeBroadcasted: {
        this.setFilter('includeBroadcasted', true);
        this.setFilter('includeUnbroadcasted', false);

        break;
      }
      case EVENT_TABS_FILTERS_BROADCAST.includeUnbroadcasted: {
        this.setFilter('includeBroadcasted', false);
        this.setFilter('includeUnbroadcasted', true);
      }
    }

    this.getEventsData();
  }

  public async openFilters(): Promise<void> {
    const modal = await this.modalController.create(this.prepareEventsListFiltersComponent());

    await modal.present();

    const result = await modal.onDidDismiss();

    if (!result.data) return;

    this.eventsFiltersStore.setFilters(result.data);
    this.getEventsData();
  }

  private setFilter<K extends keyof EventsFilters>(field: keyof EventsFilters, value: EventsFilters[K]): void {
    this.eventsFiltersStore.setFilterField(field, value);
  }

  private prepareEventsListFiltersComponent(): ModalOptions {
    return {
      component: EventsListFiltersComponent,
      cssClass: 'custom-modal-auto-height',
      initialBreakpoint: 1,
      breakpoints: [0, 1],
      handle: true,
      componentProps: {
        filters: this.eventsFiltersStore.filters(),
        eventMode: this.eventsFiltersStore.eventMode(),
      },
    };
  }

  private getEventsData(): void {
    this.eventsStore.getEvents();
  }
}
